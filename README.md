Image processing API
Resize & compress image from URL. You can use this API to create different sizes of images.

$ npm install
Starting App
$ node index.js
After starting navigate to http://localhost:5000

Query Parameter
?q={quality <=100 (Default: 60)}
?s={image size}
?w={width}
?h={height}
?fit={contain, cover, fill, outside, inside}
?bg={Background color for cropped area}
http://localhost:5000/public/{filename}?q=90&s=200&fit=inside


