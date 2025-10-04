# Test script for the Book Library API

Write-Host "🧪 Testing Book Library API..." -ForegroundColor Green

# Test the test endpoint
Write-Host "`n📝 Testing POST /api/v1/authors/test" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/authors/test" -Method Post -ContentType "application/json" -Body '{"message": "Hello from test script"}'
    Write-Host "✅ Success: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test getting all authors
Write-Host "`n📝 Testing GET /api/v1/authors" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/authors" -Method Get
    Write-Host "✅ Success: Retrieved $($response.data.length) authors" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Test completed!" -ForegroundColor Green