package com.blumbit.compras_ventas.service.spec;

import java.io.File;

import com.blumbit.compras_ventas.dto.file.FileDownloadResponse;
import com.blumbit.compras_ventas.dto.file.FileRequest;
import com.blumbit.compras_ventas.dto.file.FileResponse;

public interface IFileService {

    FileResponse createFile(FileRequest fileRequest);

    File retrieveFile(FileResponse fileResponse);

    FileDownloadResponse fileDownload(String filePath);
}
