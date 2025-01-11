# Advanced Product Data Table Web App

## Overview
This project is an advanced web application designed to display, manipulate, and analyze product data efficiently. Built using modern web technologies, it offers comprehensive features such as column visibility toggles, sorting, filtering, grouping, pagination, and custom data rendering. The application provides a user-friendly interface and ensures seamless interaction with large datasets.

## Features

### 1. View/Hide Columns
- Toggle the visibility of specific columns to customize the displayed data.

### 2. Sorting
- Sort data in ascending or descending order on all columns.

### 3. Filtering Table Rows
#### a. Global Search
- Perform a fuzzy search across all columns using the search bar at the top-right corner.

#### b. Column-Specific Filters
- **Name Column:** Fuzzy search for names, accommodating slight variations or typos.
- **Category & Subcategory Columns:** Multi-select dropdown filter with facet generation for exact matches.
- **Price Column:** Range filter with a slider to select a minimum and maximum price.
- **CreatedAt Column:** Date range filter using a calendar, with selectable dates limited to the dataset’s range.

### 4. Grouping Column Data
- Group data by category and subcategory, either simultaneously or independently. A side panel provides intuitive controls for grouping configuration.

### 5. Pagination
- Display 10 rows per page with navigation controls at the bottom of the table.

### 6. Custom Cell Value Rendering
- Format the `createdAt` and `updatedAt` columns to local datetime in the format `DD-MMM-YYYY`.

## Live Demo
[View Here](https://shivi-product-table.netlify.app/)

## Tech Stack
- **Frameworks, Libraries & Languages:** React, TypeScript
- **Styling:** Tailwind CSS
- **Search:** Fuse.js
- **Date Selection:** react-date-range
- **Icons:** lucide-react
- **Utilities:** clsx, moment
- **Table Management:** @tanstack/react-table

## Project Structure
- **`src/components`**: Reusable React components for the table, filters, grouping, etc.
- **`src/data`**: Dummy product data for demonstration purposes.
- **`src/utils`**: Utility functions for data manipulation and formatting.
- **`src/styles`**: Custom Tailwind CSS configurations.

## Dummy Product Data
The product data follows this structure:
```typescript
type ProductType = {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    createdAt: string;
    updatedAt: string;
    price: number;
    sale_price?: number | null;
};
```

## Key Dependencies
- **Fuse.js:** For fuzzy search functionality.
- **react-date-range:** To implement the date range filter.
- **@tanstack/react-table:** Provides advanced table functionalities.
- **Tailwind CSS:** Ensures a responsive and modern UI design.
- **moment:** Formats date and time values.

## Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/ShivangamSoni/products-table.git
   ```
2. Navigate to the project directory:
   ```bash
   cd products-table
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm start
   ```
