import parallelTransform from 'parallel-transform';

const stream = parallelTransform(10, function (data, callback) { // 10 is the parallism level
  setTimeout(function () {
    callback(null, data);
  }, Math.random() * 1000);
});

for (let i = 0; i < 100; i++) {
  stream.write('' + i);
}

stream.end();

stream.on('data', function (data) {
  console.log(data); // prints 0,1,2,... outputs are in order
});

stream.on('end', function () {
  console.log('stream has ended');
});
