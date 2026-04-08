const fetch = require('node-fetch');

async function testKhalti() {
    const payload = {
        return_url: "http://localhost:3000/payment/success",
        website_url: "http://localhost:3000/",
        amount: 55100 * 100,
        purchase_order_id: "test12345",
        purchase_order_name: "Cart Items",
        customer_info: {
            name: "Ganesh",
            email: "test@example.com",
            phone: "9800000000"
        }
    };

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: 'POST',
        headers: {
            'Authorization': `Key 897bb5ea4c644edcaf72c481b5c5d038`, // Using key from .env file
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(data);
}

testKhalti();
