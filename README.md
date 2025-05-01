# ExamGuard - Online Examination System

**ExamGuard** is a cutting-edge multi-user online examination platform that uses AI-driven question generation, real-time proctoring, and advanced cheating detection techniques. The system provides real-time facial, voice, and gaze-based monitoring, ensuring secure and transparent exams. It utilizes **Google's FaceLandmarker API** for real-time face recognition, **Solana Blockchain** for secure data storage, and **Socket.IO** for real-time communication, making it a scalable and highly reliable solution for remote assessments.

![ExamGuard Logo](path_to_logo_image.png)  <!-- Replace with the actual logo image path -->

## Features

- **Admin & User Roles**: 
  - Admin (Teacher) can create exams, monitor results, and manage student activities.
  - Users (Students) take exams, and their activities are monitored for any potential cheating.
  
- **AI-Based Question Generation**:
  - Automatically generates exam questions to ensure variety and fairness.

- **Real-Time Proctoring**:
  - **Google’s FaceLandmarker API** is integrated to monitor facial recognition, voice, and gaze-based cheating detection.
  - Detects if the student is looking away, using a different device, or speaking during the exam.

- **Socket.IO Integration**:
  - Real-time communication between the server and client, allowing exam status updates without refreshing the page.
  - Immediate feedback and rejection of users found cheating.

- **Blockchain for Integrity**:
  - Uses **Solana Blockchain** to securely store exam data and halt the exam if cheating is detected.
  - Ensures data integrity and transparency in the examination process.

- **Patented System**:
  - The exam platform is patented, offering up to **70% higher cheating detection accuracy** and **60% more security** than conventional systems.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Harshbhavsar2004/web-examination.git
    ```

2. Navigate to the project directory:
    ```bash
    cd web-examination
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

4. Run the application:
    ```bash
    npm start
    ```

## How It Works

### 1. **User Registration and Login**
- Students register and log in to their accounts, with exams available based on their course or subject.

![User Registration](path_to_registration_image.png)  <!-- Replace with actual image -->

### 2. **Admin Creates and Manages Exams**
- Admins can create exams manually or using AI-based question generation.
- Admins can also view results and monitor student activities during the exam.

![Admin Dashboard](path_to_admin_dashboard_image.png)  <!-- Replace with actual image -->

### 3. **Real-Time Proctoring and Cheating Detection**
- The system uses **Google’s FaceLandmarker API** for real-time facial recognition and gaze-based detection. If the student is found cheating, the system halts the exam.
- Voice-based cheating detection using the microphone ensures no cheating attempts via sound.

![Proctoring Process](path_to_proctoring_image.png)  <!-- Replace with actual image -->

### 4. **Socket.IO for Real-Time Updates**
- Socket.IO ensures that any actions during the exam, such as cheating detection or status updates, are immediately reflected on the student’s interface without requiring a page refresh.

![Real-Time Updates](path_to_socket_io_image.png)  <!-- Replace with actual image -->

### 5. **Blockchain Integration for Security**
- All exam data is stored on the **Solana Blockchain**, ensuring that once the exam is taken, the data cannot be tampered with.
- The exam automatically halts and stores all actions if cheating is detected.

![Blockchain Integration](path_to_blockchain_image.png)  <!-- Replace with actual image -->

### 6. **Patented Cheating Detection System**
- The system is **patented** for its innovative approach to cheating detection and secure exam management.
- The platform provides enhanced accuracy in detecting cheating, with up to **70% higher detection rates** compared to traditional online exam systems.

## Technologies Used

- **Frontend**: React.js, Next.js, Socket.IO, shadcn/UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Blockchain**: Solana
- **Machine Learning**: Google’s FaceLandmarker API
- **Real-Time Communication**: Socket.IO
- **Deployment**: Vercel

## Contributions

- Developed and maintained a patented multi-user exam-taking platform with AI-based question generation and real-time cheating detection.
- Integrated **Solana Blockchain** for data integrity, halting exams if cheating is detected.
- Ensured real-time communication through **Socket.IO** to provide instant updates without page refreshes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### How to Contribute

1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with detailed descriptions of the changes you made.

---

Feel free to make adjustments and replace placeholders like `path_to_logo_image.png` with actual paths to your images. Let me know if you need anything else!
