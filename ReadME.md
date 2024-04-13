# UBPMadeEasy API Documentation

Welcome to the Unified Business Permit API documentation. This API provides endpoints to manage common business activities, industries, business categories, and more.

## Endpoints

### Get UBP Common Business Activities

- **URL:** `/api/naics`
- **Method:** GET
- **Description:** Get a list of common business activities.
- **Response:** List of common business activities.

### Get UBP Industries

- **URL:** `/api/naics/industries`
- **Method:** GET
- **Description:** Get a list of industries.
- **Response:** List of industries.

### Get UBP Finance Act

- **URL:** `/api/naics/financeact`
- **Method:** GET
- **Description:** Get finance acts related to business activities.
- **Response:** List of finance acts.

### Get UBP Business Categories

- **URL:** `/api/naics/businesscategories`
- **Method:** GET
- **Description:** Get a list of business categories.
- **Response:** List of business categories.

### Get UBP Business SubCategories

- **URL:** `/api/naics/businesssubcategories`
- **Method:** GET
- **Description:** Get a list of business subcategories.
- **Response:** List of business subcategories.

### Create UBP

- **URL:** `/api/naics`
- **Method:** POST
- **Description:** Create a new business activity.
- **Request Body:** `{ commonBusinessActivity, naicsCode }`
- **Response:** Success message.

### Get UBP Activity by Common Business Activity

- **URL:** `/api/naics/:commonBusinessActivity`
- **Method:** GET
- **Description:** Get a business activity by its common name.
- **Response:** Business activity details.

### Get UBP Business Activities

- **URL:** `/api/naics/businessactivities`
- **Method:** GET
- **Description:** Get a list of business activities.
- **Response:** List of business activities.

### Upload UBP

- **URL:** `/api/naics/uploadUBP`
- **Method:** POST
- **Description:** Upload multiple business activities.
- **Request Body:** `{ commonBusinessActivity[], naicsCode[] }`
- **Response:** Success message and list of created entries.

### Update UBP

- **URL:** `/api/naics/updateUBP`
- **Method:** POST
- **Description:** Update multiple business activities.
- **Request Body:** `{ commonBusinessActivity[], naicsCode[] }`
- **Response:** Success message and list of updated entries.

### Create the UBP Industry

- **URL:** `/api/naics/industry`
- **Method:** POST
- **Description:** Create a new industry.
- **Request Body:** `{ industry, industryCode }`
- **Response:** Success message.

### Get UBP Industry by industry code

- **URL:** `/api/naics/industry/:industryCode`
- **Method:** GET
- **Description:** Get an industry by its code.
- **Response:** Industry details.

### Upload Business Categories

- **URL:** `/api/naics/uploadBusinessCategories`
- **Method:** POST
- **Description:** Upload multiple business categories.
- **Request Body:** `{ businessCategory[], businessCategoryCode[] }`
- **Response:** Success message and list of created entries.

### Get UBP Business Categories by business category code

- **URL:** `/api/naics/businesscategories/:businessCategoryCode`
- **Method:** GET
- **Description:** Get a business category by its code.
- **Response:** Business category details.

### Upload Business SubCategories

- **URL:** `/api/naics/uploadBusinessSubCategories`
- **Method:** POST
- **Description:** Upload multiple business subcategories.
- **Request Body:** `{ businessSubCategory[], businessSubCategoryCode[] }`
- **Response:** Success message and list of created entries.

### Get UBP Business SubCategories by business subcategory code

- **URL:** `/api/naics/businesssubcategories/:businessSubCategoryCode`
- **Method:** GET
- **Description:** Get a business subcategory by its code.
- **Response:** Business subcategory details.

### Upload UBP Bulk Business Activities

- **URL:** `/api/naics/uploadBusinessActivities`
- **Method:** POST
- **Description:** Upload multiple business activities in bulk.
- **Request Body:** `{ businessActivities[] }`
- **Response:** Success message and result of the bulk operation.

### Get UBP Business Activity by business activity code

- **URL:** `/api/naics/businessactivities/:businessActivityCode`
- **Method:** GET
- **Description:** Get a business activity by its code.
- **Response:** Business activity details.

### Upload FinanceAct

- **URL:** `/api/naics/uploadFinanceAct`
- **Method:** POST
- **Description:** Upload finance acts related to business activities.
- **Request Body:** `{ brimCode[], naicsCode[], subCategory[], businessDescription[], tradeLicence[], fireClearance[], foodHygiene[], healthCertificate[], pestControl[] }`
- **Response:** Success message and list of created entries.

### Get Finance Act by naics code

- **URL:** `/api/naics/financeact/:naicsCode`
- **Method:** GET
- **Description:** Get finance acts by NAICS code.
- **Response:** List of finance acts.

## Usage

1. Clone the repository:
   git clone <repository_url>

## Install dependencies

```bash
cd <project_directory>
npm install


```bash
npm run dev
