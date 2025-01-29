// @desc    Get UBP Welcome Message
// @route   GET /
// @access  Public
const getHome = (req, res) => {
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to UBPMadeEasy API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin: 50px; background-color:#065A38}
          h1 { color: #FBCC1A; }
          p { color: #FBCC1A; }
        </style>
      </head>
      <body>
        <h1>Welcome to the UBPMadeEasy API</h1>
        <p>Navigate UBP Easily!</p>
      </body>
      </html>
    `;
  
    res.status(200).send(htmlResponse);
  };
  
  module.exports = { getHome };
  