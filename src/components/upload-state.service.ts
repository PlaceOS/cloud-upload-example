import {
    humanReadableByteCount,
    Upload,
    uploadFiles,
} from "@placeos/cloud-uploads";
import { BehaviorSubject, Observable } from "rxjs";
import { takeWhile } from "rxjs/operators";

import * as blobUtil from "blob-util";

export interface UploadDetails {
    /** Unique ID for the upload */
    id: number;
    /** Name of the file uploaded */
    name: string;
    /** Progress of the file upload */
    progress: number;
    /** Link to the uploaded file */
    link: string;
    /** Formatted file size */
    formatted_size: string;
    /** Size of the file being uploaded */
    size: number;
    /** Error with upload request */
    error?: string;
    /** Upload object associated with the file */
    upload: Upload;
}

const _upload_list = new BehaviorSubject<UploadDetails[]>([]);
export const upload_list = _upload_list.asObservable();

function _updateUploadHistory() {
    const done_list = _upload_list
        .getValue()
        .filter((file) => file.progress >= 100);
    done_list.forEach((i) => delete i.upload);
}

let COUNTER = 0;

/**
 * Upload the given file to the cloud
 * @param file File to upload
 */
function _uploadFile(file: File): Observable<UploadDetails> {
    return new Observable((observer) => {
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", (e: any) => {
            const arrayBuffer = e.target.result;
            const upload_details: UploadDetails = {
                id: COUNTER++,
                name: file.name,
                progress: 0,
                link: "",
                formatted_size: humanReadableByteCount(file.size),
                size: file.size,
                upload: null,
            };
            const blob = blobUtil.arrayBufferToBlob(arrayBuffer, file.type);
            const upload_list = uploadFiles([blob], { file_name: file.name });
            const upload = upload_list[0];
            upload_details.upload = upload;
            upload.status
                .pipe(takeWhile((_) => _.status !== "complete", true))
                .subscribe(
                    (state) => {
                        if (upload.access_url)
                            upload_details.link = upload.access_url;
                        upload_details.progress = state.progress;
                        observer.next(upload_details);
                        if (state.status === "error")
                            observer.error({
                                ...upload_details,
                                error: state.error,
                            });
                        if (state.status === "complete") observer.complete();
                    },
                    (e) => (upload_details.error = e)
                );
            observer.next(upload_details);
        });
        fileReader.readAsArrayBuffer(file);
    });
}

export function uploadFile(file: File) {
    return new Promise<number>((resolve) => {
        let resolved = false;
        const update_fn = (details) => {
            if (!resolved) {
                resolve(details.id);
                resolved = true;
            }
            _upload_list.next([
                ..._upload_list.getValue().filter((_) => _.id !== details.id),
                details,
            ]);
        };
        _uploadFile(file).subscribe(update_fn, update_fn, () =>
            _updateUploadHistory()
        );
    });
}
