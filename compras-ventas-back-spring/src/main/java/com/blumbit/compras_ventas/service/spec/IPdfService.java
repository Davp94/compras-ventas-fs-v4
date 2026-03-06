package com.blumbit.compras_ventas.service.spec;

import java.util.Map;

public interface IPdfService {

    byte[] generatePdfFromHtml(String templateName, Map<String, Object> data);
}
