
# modmap-cli

`modmap-cli` is a cross-platform CLI tool that helps developers to identity which files and functions are being used in specific module or task.

### 🧩 Why modmap?

In large teams and growing codebases, when a developer finishes a module (e.g., "Payments"), and another developer picks it up days or weeks later, it's time-consuming to understand:
- Which files are involved
- Which functions were used
- Which specific lines of code belong to a module

With `modmap-cli`, this mapping becomes explicit, searchable, and centralized in a `.modmap` directory.

---

## 🚀 Installation

```bash
npm install -g modmap-cli
```

> **Node Version Required:** Node.js `v14+`
>
> **NPM Version Required:** NPM `v6+`

---

## 🔧 Commands

### 1. Initialize in your project

```bash
modmap init --tz UTC
```
Creates a `.modmap/` directory and sets the default timezone.

---

### 2. Tag a module with file

```bash
modmap tag --module jobs --file src/jobs.js --desc "Initial job entry"
```

---

### 3. Tag a module with a function

```bash
modmap tag --module jobs --function createJob --desc "Validates and stores job entry"
```

---

### 4. Tag a module with a specific line number

```bash
modmap tag --module jobs --line src/utils/jobHelper.js:89 --desc "Validator for job title format"
```

---

### 5. Tag a module with file and function in the same command

```bash
modmap tag --module payments --file src/pay.js --function handlePayment --desc "Payment processing flow"
```

---

### 6. Query a module’s metadata

```bash
modmap query jobs
```

---

### 7. Change project-wide timezone (affects future entries only).

```bash
modmap config --tz Asia/Kolkata
```
WARNING: before changing timezone, take backup of all json files. If u enter wrong time zone then it will make timestamp NULL in all json files and there is no way to revert it back later.

---

### 8. Supported Timezones

- UTC
- Asia/Kolkata
- Asia/Dubai
- Asia/Singapore
- Asia/Tokyo
- Asia/Shanghai
- Europe/London
- Europe/Paris
- Europe/Berlin
- Europe/Moscow
- America/New_York
- America/Chicago
- America/Denver
- America/Los_Angeles
- America/Toronto
- Australia/Sydney
- Australia/Melbourne
- Pacific/Auckland
