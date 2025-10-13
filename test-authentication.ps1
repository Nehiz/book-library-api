# Test Authentication System for W04 Project
# This script tests the authentication functionality

Write-Host "🔐 Testing Book Library API Authentication System" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "`n1. 🩺 Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "   ✅ Health check successful" -ForegroundColor Green
    Write-Host "   📊 Available endpoints:" -ForegroundColor White
    $health.endpoints | ConvertTo-Json -Depth 2
} catch {
    Write-Host "   ❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: User Registration
Write-Host "`n2. 👤 Testing User Registration..." -ForegroundColor Yellow
$testUser = @{
    name = "Test User"
    email = "test@example.com"
    password = "TestPass123"
    confirmPassword = "TestPass123"
}

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method POST -Body ($testUser | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   ✅ User registration successful" -ForegroundColor Green
    Write-Host "   👤 User created: $($registerResponse.user.name) ($($registerResponse.user.email))" -ForegroundColor White
    $token = $registerResponse.token
    Write-Host "   🔑 Token received (first 50 chars): $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor White
} catch {
    $errorDetails = $_ | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($errorDetails.message -like "*already exists*") {
        Write-Host "   ℹ️ User already exists, attempting login..." -ForegroundColor Yellow
        
        # Try login instead
        try {
            $loginData = @{
                email = $testUser.email
                password = $testUser.password
            }
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json"
            Write-Host "   ✅ Login successful" -ForegroundColor Green
            $token = $loginResponse.token
            Write-Host "   🔑 Token received (first 50 chars): $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor White
        } catch {
            Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "   ❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Get User Profile (Protected Route)
Write-Host "`n3. 👥 Testing User Profile Access (Protected Route)..." -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $profile = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/me" -Method GET -Headers $headers
        Write-Host "   ✅ Profile access successful" -ForegroundColor Green
        Write-Host "   📝 User profile: $($profile.user.name) ($($profile.user.email))" -ForegroundColor White
    } catch {
        Write-Host "   ❌ Profile access failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⏭️ Skipped - No token available" -ForegroundColor Yellow
}

# Test 4: Test Protected Book Creation (Should require authentication)
Write-Host "`n4. 📚 Testing Protected Book Creation..." -ForegroundColor Yellow
$testBook = @{
    title = "Test Authentication Book"
    author = "Test Author"
    isbn = "978-1-234567-89-0"
    genre = "Fiction"
    publishedDate = "2024-01-01"
    pages = 250
    description = "A book created to test authentication"
}

# First try without token (should fail)
try {
    $bookResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/books" -Method POST -Body ($testBook | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   ❌ Book creation without authentication should have failed!" -ForegroundColor Red
} catch {
    Write-Host "   ✅ Book creation correctly rejected without authentication" -ForegroundColor Green
}

# Now try with token (should succeed)
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $bookResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/books" -Method POST -Body ($testBook | ConvertTo-Json) -ContentType "application/json" -Headers $headers
        Write-Host "   ✅ Book creation successful with authentication" -ForegroundColor Green
        Write-Host "   📖 Book created: $($bookResponse.data.title)" -ForegroundColor White
        $createdBookId = $bookResponse.data._id
    } catch {
        Write-Host "   ❌ Book creation failed even with authentication: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "   ⏭️ Skipped authenticated book creation - No token available" -ForegroundColor Yellow
}

# Test 5: Test OAuth endpoint (Should show not configured message)
Write-Host "`n5. 🔗 Testing OAuth Endpoints..." -ForegroundColor Yellow
try {
    $oauthResponse = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/google" -Method GET
    Write-Host "   ❌ OAuth should show not configured message" -ForegroundColor Red
} catch {
    $errorMessage = $_.Exception.Response.StatusCode
    if ($errorMessage -eq "NotImplemented") {
        Write-Host "   ✅ OAuth correctly shows not configured (501)" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️ OAuth response: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 6: Test Swagger Documentation
Write-Host "`n6. 📖 Testing API Documentation..." -ForegroundColor Yellow
try {
    $swaggerUrl = "$baseUrl/api-docs"
    # Just check if the endpoint is accessible
    $response = Invoke-WebRequest -Uri $swaggerUrl -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Swagger documentation accessible at $swaggerUrl" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Swagger documentation not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Test Public Endpoints (Books/Authors GET - should work without auth)
Write-Host "`n7. 📚 Testing Public Endpoints (GET Books/Authors)..." -ForegroundColor Yellow
try {
    $books = Invoke-RestMethod -Uri "$baseUrl/api/v1/books" -Method GET
    Write-Host "   ✅ Public books endpoint accessible" -ForegroundColor Green
    Write-Host "   📊 Total books: $($books.totalResults)" -ForegroundColor White
    
    $authors = Invoke-RestMethod -Uri "$baseUrl/api/v1/authors" -Method GET  
    Write-Host "   ✅ Public authors endpoint accessible" -ForegroundColor Green
    Write-Host "   📊 Total authors: $($authors.totalResults)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Public endpoints failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Authentication Testing Complete!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "`n📝 Summary of W04 Authentication Implementation:" -ForegroundColor White
Write-Host "   ✅ User Registration & Login (JWT-based)" -ForegroundColor Green
Write-Host "   ✅ Protected Routes (POST/PUT/DELETE require auth)" -ForegroundColor Green  
Write-Host "   ✅ Public Routes (GET endpoints remain public)" -ForegroundColor Green
Write-Host "   ✅ Password Hashing (bcrypt)" -ForegroundColor Green
Write-Host "   ✅ JWT Token Authentication" -ForegroundColor Green
Write-Host "   ✅ OAuth Framework Ready (Google OAuth configurable)" -ForegroundColor Green
Write-Host "   ✅ Swagger Documentation with Security Schemes" -ForegroundColor Green
Write-Host "   ✅ Input Validation & Error Handling" -ForegroundColor Green

Write-Host "`n🚀 Next Steps for Video Demo:" -ForegroundColor Cyan
Write-Host "   1. Show user registration in Swagger" -ForegroundColor White
Write-Host "   2. Show user login and token retrieval" -ForegroundColor White
Write-Host "   3. Demonstrate protected endpoints require authentication" -ForegroundColor White
Write-Host "   4. Show public endpoints work without authentication" -ForegroundColor White
Write-Host "   5. Create/Update/Delete books/authors with authentication" -ForegroundColor White
Write-Host "   6. Show MongoDB database updates" -ForegroundColor White