import pytest
from app.utils.pdf_handler import PDFProcessor

def test_pdf_processor_invalid_file(tmp_path):
    """Garante que o processador consegue lidar com exceções caso o PDF não exista ou seja inválido."""
    fake_pdf = tmp_path / "fake.pdf"
    fake_pdf.write_text("Not a PDF file content")
    
    processor = PDFProcessor(str(fake_pdf))
    text = processor.extract_text()
    
    # A implementação atual do PDFProcessor captura a exceção do PyMuPDF e retorna string vazia
    assert text == ""
