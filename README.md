# LSEG Interview Task

## Notes During Process
1. Renamed `logs.log` file to `input.txt`, so that `.gitignore` does not affect it.  
2. Exported methods to be visible for **TypeDoc**.  

---

## Introduction
This document is going to explain why I should get this position and that I am an amazing developer...  
*just a joke 😅*  

However, I will try to provide as much guidance as I can for the evaluation process.  

---

## ⚙️ Setup

### 1. Build the project
After pulling the repository, open the project root in **cmd** (or any terminal) and run:  

```bash
npm run build
````

👉 Make sure you have **Node.js** installed.

---

### 2. Prepare input data

Ensure that the file:

```
dist/files/input.txt
```

contains all the input data that was provided in the email.

📖 Documentation for each method, class, and interface is available under the **`docs/`** folder.

---

### 3. Run the project locally

```bash
npm start
```

---

### 4. Run tests

You can run all tests with:

```bash
npm test
```

Or, if you’re chasing that sweet **100% test coverage**:

```bash
npm run test:coverage
```

---

## 📂 Project Structure

```
lseg-interview/
├── dist/             # Compiled JavaScript output
│   └── files/        # Input & output text files
├── docs/             # Generated TypeDoc documentation
├── src/              # Source code
│   ├── enums/        # Enums like JobAction
│   ├── models/       # Job model definitions
│   ├── index.ts      # Main entry point
│   └── tests/        # Jest unit tests
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── typedoc.json      # TypeDoc configuration
```

---

## 📬 Contact

If you have any questions, please don’t hesitate to reach out:

* **Email:** [racaldare@gmail.com](mailto:racaldare@gmail.com)
* **LinkedIn:** [Roman Caldararu](https://www.linkedin.com/in/roman-caldare-a76b31170/)