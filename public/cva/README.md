# CVA analysis outputs (Quarto)

Rendered Quarto outputs go here. Everything in `public/` is copied to the site as-is.

Folder convention (it matches the links on each page):

    cva/programme/                         programme-level analysis
    cva/cluster-1/  cva/cluster-2/         cluster analyses
    cva/<cluster>/<country>/               country analyses, e.g. cva/cluster-2/malawi/
    cva/<cluster>/<country>/<district>/    district analyses, e.g. cva/cluster-2/malawi/chikwawa/

Inside each folder:
    index.html     Quarto HTML report      (quarto render report.qmd --output-dir …)
    brief.pdf      summary brief (PDF)
    slides/        Quarto Reveal.js slides
