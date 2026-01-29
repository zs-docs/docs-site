# API Integration Examples

## 🎯 Overview

This section provides practical examples for integrating with ZARISH HIS APIs, including authentication,
data submission, and error handling.

## 📋 Authentication Examples

### API Key Authentication

```bash
# Set up API key
export ZARISH_API_KEY="your-api-key-here"
export ZARISH_BASE_URL="https://api.zarish-his.com/v1"

# Make authenticated request
curl -X GET "${ZARISH_BASE_URL}/patients" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json"
```

### JWT Token Authentication

```bash
# Login to get JWT token
curl -X POST "${ZARISH_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your-username",
    "password": "your-password"
  }'

# Use JWT token for subsequent requests
curl -X GET "${ZARISH_BASE_URL}/patients" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## 🏥 Patient Registration Examples

### Register Bangladeshi Patient

```bash
curl -X POST "${ZARISH_BASE_URL}/patients" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mohammad",
    "lastName": "Rahman",
    "dateOfBirth": "1990-01-01",
    "gender": "M",
    "nationality": "BD",
    "nationalId": "1234567890123",
    "phoneNumber": "+8801234567890",
    "address": {
      "division": "BD.3",
      "district": "BD.3.01",
      "upazila": "BD.3.01.01",
      "union": "BD.3.01.01.01",
      "village": "Dhaka",
      "postCode": "1000"
    },
    "emergencyContact": {
      "name": "Fatema Begum",
      "relationship": "Spouse",
      "phoneNumber": "+8801234567891"
    }
  }'
```

### Register Rohingya Refugee Patient

```bash
curl -X POST "${ZARISH_BASE_URL}/patients" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ayesha",
    "lastName": "Begum",
    "dateOfBirth": "1985-05-15",
    "gender": "F",
    "nationality": "ROH",
    "progressId": "PROG123456789",
    "mrcCard": "MRC987654321",
    "familyCountingNumber": "FCN-KTP-BLOCK-A-001",
    "phoneNumber": "+8801234567892",
    "address": {
      "campName": "Kutupalong",
      "block": "Block A",
      "subBlock": "Sub-Block 1",
      "shelter": "Shelter 123"
    },
    "emergencyContact": {
      "name": "Mohammad Hassan",
      "relationship": "Brother",
      "phoneNumber": "+8801234567893"
    }
  }'
```

## 📅 Appointment Booking Examples

### Book OPD Appointment

```bash
curl -X POST "${ZARISH_BASE_URL}/appointments" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT123456789",
    "serviceType": "GOPD",
    "appointmentType": "ROUTINE_CONSULTATION",
    "practitionerId": "PRAC123456789",
    "scheduledDateTime": "2026-01-21T09:00:00+06:00",
    "duration": 15,
    "reason": "Routine check-up"
  }'
```

### Book NCD Follow-up Appointment

```bash
curl -X POST "${ZARISH_BASE_URL}/appointments" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT123456789",
    "serviceType": "NCD",
    "appointmentType": "NCD_FOLLOWUP",
    "practitionerId": "PRAC123456789",
    "scheduledDateTime": "2026-01-21T10:00:00+06:00",
    "duration": 30,
    "reason": "Monthly hypertension follow-up",
    "supportingInformation": [
      {
        "type": "previous_observation",
        "reference": "OBS123456789",
        "display": "Blood Pressure - 15 Jan 2026"
      }
    ]
  }'
```

## 🧪 Laboratory Test Examples

### Request Laboratory Test

```bash
curl -X POST "${ZARISH_BASE_URL}/laboratory/tests" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT123456789",
    "testType": "COMPREHENSIVE_METABOLIC_PANEL",
    "requestedBy": "PRAC123456789",
    "requestedDateTime": "2026-01-21T08:00:00+06:00",
    "specimen": {
      "type": "BLOOD",
      "collectionDateTime": "2026-01-21T08:00:00+06:00",
      "volume": "5 mL"
    },
    "tests": [
      {
        "code": "HBA1C",
        "name": "Hemoglobin A1c"
      },
      {
        "code": "FASTING_GLUCOSE",
        "name": "Fasting Glucose"
      },
      {
        "code": "TOTAL_CHOLESTEROL",
        "name": "Total Cholesterol"
      }
    ]
  }'
```

## 💊 Medication Examples

### Create Prescription

```bash
curl -X POST "${ZARISH_BASE_URL}/medications" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT123456789",
    "prescribedBy": "PRAC123456789",
    "prescribedDateTime": "2026-01-21T09:30:00+06:00",
    "medications": [
      {
        "name": "Paracetamol",
        "strength": "500mg",
        "form": "Tablet",
        "dosage": {
          "frequency": "EVERY_8_HOURS",
          "quantity": 1,
          "duration": "24 hours",
          "asNeeded": true
        },
        "quantity": {
          "amount": 20,
          "unit": "tablet"
        },
        "instructions": "Take one tablet every 8 hours as needed for pain"
      }
    ]
  }'
```

## 🔍 Error Handling Examples

### Handle API Errors

```bash
# Make request with error handling
response=$(curl -s -w "%{http_code}" -X GET "${ZARISH_BASE_URL}/patients/PAT123456789" \
  -H "Authorization: Bearer ${ZARISH_API_KEY}" \
  -H "Content-Type: application/json")

http_code="${response: -3}"

if [ "$http_code" -eq 200 ]; then
  echo "✅ Request successful"
  # Process response body (remove last 3 characters for HTTP code)
  response_body="${response%???}"
  echo "$response_body" | jq '.'
elif [ "$http_code" -eq 401 ]; then
  echo "❌ Authentication failed - check API key"
elif [ "$http_code" -eq 404 ]; then
  echo "❌ Patient not found"
elif [ "$http_code" -eq 429 ]; then
  echo "❌ Rate limit exceeded - try again later"
else
  echo "❌ Request failed with HTTP code: $http_code"
fi
```

### Retry Logic for Failed Requests

```bash
# Function to retry failed requests
retry_request() {
  local max_attempts=3
  local attempt=1
  local delay=2
  
  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt of $max_attempts..."
    
    response=$(curl -s -w "%{http_code}" -X GET "$1" \
      -H "Authorization: Bearer ${ZARISH_API_KEY}" \
      -H "Content-Type: application/json")
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
      echo "✅ Request successful on attempt $attempt"
      response_body="${response%???}"
      echo "$response_body"
      return 0
    fi
    
    echo "❌ Attempt $attempt failed with HTTP code: $http_code"
    
    if [ $attempt -lt $max_attempts ]; then
      echo "Waiting $delay seconds before retry..."
      sleep $delay
      delay=$((delay * 2))
    fi
    
    attempt=$((attempt + 1))
  done
  
  echo "❌ All attempts failed"
  return 1
}

# Usage
retry_request "${ZARISH_BASE_URL}/patients/PAT123456789"
```

## 📊 Data Validation Examples

### Validate Patient Data

```bash
# Function to validate patient data
validate_patient_data() {
  local patient_data="$1"
  
  # Check required fields
  if ! echo "$patient_data" | jq -e '.firstName' > /dev/null; then
    echo "❌ Missing firstName"
    return 1
  fi
  
  if ! echo "$patient_data" | jq -e '.lastName' > /dev/null; then
    echo "❌ Missing lastName"
    return 1
  fi
  
  if ! echo "$patient_data" | jq -e '.dateOfBirth' > /dev/null; then
    echo "❌ Missing dateOfBirth"
    return 1
  fi
  
  # Validate national ID format for Bangladeshi patients
  nationality=$(echo "$patient_data" | jq -r '.nationality')
  if [ "$nationality" = "BD" ]; then
    national_id=$(echo "$patient_data" | jq -r '.nationalId')
    if ! [[ "$national_id" =~ ^[0-9]{13}$ ]]; then
      echo "❌ Invalid Bangladeshi National ID format"
      return 1
    fi
  fi
  
  echo "✅ Patient data validation passed"
  return 0
}

# Usage
patient_data='{
  "firstName": "Mohammad",
  "lastName": "Rahman",
  "dateOfBirth": "1990-01-01",
  "nationality": "BD",
  "nationalId": "1234567890123"
}'

validate_patient_data "$patient_data"
```

## 🚀 Rate Limiting Examples

### Implement Rate Limiting

```bash
# Rate limiting configuration
RATE_LIMIT=100  # requests per minute
RATE_WINDOW=60  # seconds
REQUEST_FILE="/tmp/requests.log"

# Function to check rate limit
check_rate_limit() {
  local current_time=$(date +%s)
  local window_start=$((current_time - RATE_WINDOW))
  
  # Count requests in the current window
  local request_count=$(tail -n +1 "$REQUEST_FILE" 2>/dev/null | \
    awk -v start="$window_start" '$1 >= start { count++ } END { print count+0 }')
  
  if [ "$request_count" -ge "$RATE_LIMIT" ]; then
    echo "❌ Rate limit exceeded. $request_count requests in last $RATE_WINDOW seconds"
    echo "Please wait before making more requests"
    return 1
  fi
  
  # Log current request
  echo "$current_time" >> "$REQUEST_FILE"
  return 0
}

# Function to make rate-limited request
make_rate_limited_request() {
  if ! check_rate_limit; then
    return 1
  fi
  
  curl -X GET "$1" \
    -H "Authorization: Bearer ${ZARISH_API_KEY}" \
    -H "Content-Type: application/json"
}

# Usage
make_rate_limited_request "${ZARISH_BASE_URL}/patients"
```

---

**Examples Version**: 1.0  
**Last Updated**: January 2026  
**API Version**: v1  
**Compliance**: ZARISH HIS API Standards
