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
          body { 
            font-family: Arial, sans-serif; 
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #065A38;
          }
          .container {
            text-align: center;
          }
          h1 { color: #FBCC1A; }
          p { color: #FBCC1A; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the UBPMadeEasy API</h1>
          <p>Your API is up and running!</p>
        </div>
      </body>
      </html>
    `;
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=3600');
    res.setHeader('CDN-Cache-Control', 'max-age=60');
    res.setHeader('Cache-Control', 'max-age=10');
  
    res.status(200).send(htmlResponse);
  };
  
  module.exports = { getHome };
  