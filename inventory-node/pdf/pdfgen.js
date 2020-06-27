const { PDFDocument, StandardFonts, PageSizes } = require('pdf-lib');
const fs = require('fs');

/*
 *  Output a pdf including information specific to
 *  an individual artist.
 */ 
async function createArtistPdf(arr) {
    try {
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        const page = pdfDoc.addPage(PageSizes.Letter)
        const { width, height } = page.getSize()
        const fontSize = 24

        // draw title
        let artistsName = arr[0].firstName + ' ' + arr[0].lastName;
        page.drawText(artistsName, {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
        });
        // timestamp
        page.drawText(new Date(Date.now()).toDateString(), {
            x: 410,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
        });
        // draw lines
        page.drawLine({
            start: { x: 50, y: height - 110 },
            end: { x: width - 50, y: height - 110 }, thickness: 2
        });
        page.drawLine({
            start: { x: 50, y: height - 113 },
            end: { x: width - 50, y: height - 113 }, thickness: .5
        });
        // column headers
        page.moveTo(50, height - 130);
        page.setFontSize(16);
        page.drawText('Id#');
        page.moveTo(150, page.getY());
        page.drawText('Title');
        page.moveRight(300);
        page.drawText('Price');
        page.moveDown(7);
        // begin outputting data...
        page.setFontSize(13);
        arr.forEach(record => {
            page.moveDown(16);
            page.moveTo(50, page.getY());
            page.drawText(record.prodId.toString());
            page.moveTo(150 , page.getY())
            page.drawText(record.title);
            page.moveRight(300);
            page.drawText(`$${record.price.toString()}.00`);
        });

        const pdfBytes = await pdfDoc.save();
        
        fs.writeFileSync('artists.pdf', pdfBytes);
    } catch (err) {
        console.log(err);
    }
}


/*
 *  Output a pdf containing the complete gallery inventory.
 */ 
async function createGalleryPdf(queryResult) {
    try {
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        let allPages = [];
        let page = pdfDoc.addPage(PageSizes.Letter);
        allPages.push(page);
        const { width, height } = page.getSize()
        const fontSize = 24

        // draw title
        page.drawText("Gallery Inventory", {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
        });
        // timestamp
        page.drawText(new Date(Date.now()).toDateString(), {
            x: 410,
            y: height - 4 * fontSize,
            size: 14,
            font: timesRomanFont,
        });
        // draw lines
        page.drawLine({
            start: { x: 50, y: height - 110 },
            end: { x: width - 50, y: height - 110 }, thickness: 2
        });
        page.drawLine({
            start: { x: 50, y: height - 113 },
            end: { x: width - 50, y: height - 113 }, thickness: .5
        });
        // column headers
        page.moveTo(50, height - 130);
        page.setFontSize(16);
        page.drawText('Artist');
        page.moveTo(180, page.getY());
        page.drawText('id#');
        page.moveTo(250, page.getY());
        page.drawText('Title');
        page.moveTo(475, page.getY());
        page.drawText('Price');
        page.moveDown(7);
        // begin outputting data...
        page.setFontSize(12);
        queryResult.forEach(record => {
            page.moveDown(16);
            page.moveTo(50, page.getY());
            page.drawText(record.firstName + ' ' + record.lastName);
            page.moveTo(180, page.getY());
            page.drawText(record.prodId.toString());
            page.moveTo(250, page.getY());
            page.drawText(record.title);
            page.moveTo(475, page.getY());
            page.drawText(`$${record.price.toString()}.00`);
            // add another page if we run out of room.
            if(page.getY() <= 50) {
                page = pdfDoc.addPage(PageSizes.Letter);
                allPages.push(page);
                page.moveTo(50, height - 50);
                page.setFontSize(12);
            }
        });

        const pdfBytes = await pdfDoc.save();
        
        fs.writeFileSync('artists.pdf', pdfBytes);
    } catch (err) {
        console.log(err);
    }

}

exports.createArtistPdf = createArtistPdf;
exports.createGalleryPdf = createGalleryPdf;