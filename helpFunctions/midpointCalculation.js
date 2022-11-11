export const demoFunction = () => {
  console.log('I have exported thisfunction woo very excited');
  return 'The return is a string';
};

export function calculateMidpoint(coordinateArray) {
  // Step 1: Convert decimal degrees (used for GPS etc) in Cartesian Coordinates

  // We start by converting into Radians
  // Create an array to store the Radians Array.
  let radiansArray = [];

  // Iterate through the coordinates array and calculate
  coordinateArray.forEach(element => {
    // Calculate the latitude Radians
    let latRadians = (element.latitude * Math.PI) / 180; // We use Javascripts built in Math library to get PI

    // Calculate the longitude Radians
    let longRadians = (element.longitude * Math.PI) / 180; // Using Javascripts build in Math library to get PI again

    // Construct back into an object to maintain data integrity
    let radianLocation = {
      latitude: latRadians,
      longitude: longRadians,
    };

    // Push to the Radian Array
    radiansArray.push(radianLocation);
  });

  // Next we create our cartesian coordinates
  // Create an array to store the Cartesian Coordinates
  let cartesianArray = [];

  // Interate through the radiansArray to calculate
  radiansArray.forEach(element => {
    // Calculate x
    let x = Math.cos(element.latitude) * Math.cos(element.longitude);
    // Calculate y
    let y = Math.cos(element.latitude) * Math.sin(element.longitude);
    // Calculate z
    let z = Math.sin(element.latitude);

    // Construct into a cartesian object
    let cartesianLocation = {
      xLoc: x,
      yLoc: y,
      zLoc: z,
    };

    // Push to the cartesianArray
    cartesianArray.push(cartesianLocation);
  });

  // Not relevant for this example, but we could also set this up to weight each location if needed.

  // Iterate through the array and calculate the average for x, y, z

  // Set up variable to store the totals of each
  let xtotal = 0;
  let ytotal = 0;
  let ztotal = 0;

  cartesianArray.forEach(element => {
    xtotal += element.xLoc;
    ytotal += element.yLoc;
    ztotal += element.zLoc;
  });

  // Calculate the average by dividing the totals by the number of elements
  let xavg = xtotal / (coordinateArray.length + 1);
  let yavg = ytotal / (coordinateArray.length + 1);
  let zavg = ztotal / (coordinateArray.length + 1);

  // Convert averages back to into radians longitude and latitude
  let avgLon = Math.atan2(yavg, xavg);
  let avgHyp = Math.sqrt(xavg * xavg + yavg * yavg);
  let avgLat = Math.atan2(zavg, avgHyp);

  // Convert the location back into degrees
  let avgLatDegrees = (avgLat * 180) / Math.PI;
  let avgLongDegrees = (avgLon * 180) / Math.PI;

  // Turn into an object
  let centerObject = {
    latitude: avgLatDegrees,
    longitude: avgLongDegrees,
  };

  console.log(centerObject);
  // Return the object
  return centerObject;
}
