$ErrorActionPreference = "Continue"

$products = @(
    # SHIRTS & TOPS
    @{ name = "Graphic Vintage Tee"; description = "Soft cotton t-shirt with a faded vintage print."; price = 24.99; stock = 300 },
    @{ name = "Silk Blouse"; description = "Elegant silk blouse with a relaxed fit, perfect for office wear."; price = 65.00; stock = 50 },
    @{ name = "Flannel Plaid Shirt"; description = "Warm and cozy flannel shirt in a classic red and black plaid pattern."; price = 39.50; stock = 120 },
    
    # PANTS & BOTTOMS
    @{ name = "Distressed Skinny Jeans"; description = "Comfortable stretch denim with carefully placed distressing."; price = 59.99; stock = 80 },
    @{ name = "Linen Summer Trousers"; description = "Lightweight linen trousers ideal for warm weather and beach days."; price = 45.00; stock = 110 },
    @{ name = "Athletic Joggers"; description = "Premium fleece joggers with zipper pockets and a tapered leg."; price = 49.99; stock = 250 },
    
    # OUTERWEAR
    @{ name = "Classic Trench Coat"; description = "Water-resistant double-breasted trench coat in khaki."; price = 129.99; stock = 40 },
    @{ name = "Vegan Leather Moto Jacket"; description = "Edgy faux leather jacket with asymmetrical zip closure."; price = 89.99; stock = 60 },
    @{ name = "Puffer Winter Jacket"; description = "Insulated puffer jacket designed for extreme cold."; price = 110.00; stock = 90 },
    
    # DRESSES
    @{ name = "Floral Midi Dress"; description = "Flowy midi dress featuring a vibrant floral pattern and a wrap front."; price = 79.50; stock = 45 },
    @{ name = "Little Black Dress"; description = "The essential cocktail dress. Sleek, simple, and elegant."; price = 95.00; stock = 70 },
    
    # SHOES
    @{ name = "Classic Canvas Sneakers"; description = "Everyday low-top canvas sneakers in optical white."; price = 45.00; stock = 400 },
    @{ name = "Running Shoes"; description = "High-performance athletic shoes with breathable mesh and responsive foam."; price = 120.00; stock = 150 },
    @{ name = "Suede Loafers"; description = "Comfortable slip-on suede loafers in navy blue."; price = 85.00; stock = 85 },
    
    # ACCESSORIES
    @{ name = "Polarized Aviator Sunglasses"; description = "Classic aviator shades with polarized lenses and UV protection."; price = 29.99; stock = 200 },
    @{ name = "Minimalist Leather Watch"; description = "Sleek analog watch with a genuine leather strap and minimal dial."; price = 115.00; stock = 30 },
    @{ name = "Canvas Tote Bag"; description = "Durable heavyweight canvas tote bag for groceries or daily commute."; price = 19.99; stock = 500 }
)

echo "Authenticating..."
$loginBody = @{
    email = "testrunner3@axedrobe.com"
    password = "password123"
} | ConvertTo-Json
$token = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"

$headers = @{
    "Authorization" = "Bearer $token"
}

echo "Adding diverse products to Axedrobe..."

foreach ($product in $products) {
    $body = $product | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8082/api/products" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        echo "Successfully added: $($product.name)"
    } catch {
        echo "Failed to add $($product.name). Error: $($_.Exception.Message)"
    }
}

echo "Done! Refresh your website."
