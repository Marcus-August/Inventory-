<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add OCP Uniforms Personnel</title>
</head>
<body>
    <h1>Add OCP Uniforms Personnel</h1>
    <form action="/ocp/add" method="POST">
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div>
            <label for="pantsSize">Pants Size:</label>
            <input type="text" id="pantsSize" name="pantsSize" required>
        </div>
        <div>
            <label for="shortSize">Short Size:</label>
            <input type="text" id="shortSize" name="shortSize" required>
        </div>
        <div>
            <label for="shirtSize">Shirt Size:</label>
            <input type="text" id="shirtSize" name="shirtSize" required>
        </div>
        <div>
            <label for="rank">Rank:</label>
            <input type="text" id="rank" name="rank" required>
        </div>
        <div>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
        </div>
        <button type="submit">Add OCP Uniforms Personnel</button>
    </form>

    <!-- Displaying Inventory Image -->
    <h2>Inventory Image</h2>
    <img src="/images/inventory.jpg" alt="Inventory Image">
</body>
</html>
