/**
 * # Rules

These rules collectively define how many points should be awarded to a receipt.

* One point for every alphanumeric character in the retailer name.
* 50 points if the total is a round dollar amount with no cents.
* 25 points if the total is a multiple of `0.25`.
* 5 points for every two items on the receipt.
* If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
* 6 points if the day in the purchase date is odd.
* 10 points if the time of purchase is after 2:00pm and before 4:00pm.

*/

function calculatePoints(receipt) {
    let points = 0;

    // 1 point for every alphanumeric character in receipt.retailer
    //watch out for edge cases (i.e. '&)
    const retailer = receipt.retailer || '';
    points += (retailer.match(/[a-z0-9]/gi) || []).length;

    //50 points if the total is a round dollar amount with no cents.
    const total = parseFloat(receipt.total)
    if (Math.floor(total) === total) {
        points += 50;
    } 

    // 25 points if the total is a multiple of `0.25`.
    if (total % 0.25 === 0) {
        points += 25;
    }

    // 5 points for every two items on the receipt.
    const items = receipt.items || [];
    points += Math.floor(items.length / 2) * 5;

    // If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
    items.forEach(item => {
        const description = item.shortDescription.trim();
        if (description.length % 3 === 0) {
            const price = parseFloat(item.price);
            points += Math.ceil(price * 0.2);
        }
    })

    // Convert purchaseDate to Date Object to use get methods
    const purchaseDateTime = new Date(`${receipt.purchaseDate}T${receipt.purchaseTime}`);
    
    // 6 points if the day in the purchase date is odd.
    if (purchaseDateTime.getDate() % 2 !== 0) {
        points += 6;
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    const hours = purchaseDateTime.getHours();
    const minutes = purchaseDateTime.getMinutes();
    if (hours === 14 || (hours === 15 && minutes < 60)) {
        points += 10;
    }
    
    return points;
}

module.exports = calculatePoints;
