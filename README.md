# TripletAI

TripletAI is an application designed to handle Supervised Learning Triplets. It provides an intuitive platform to efficiently manage and curate your supervised learning triplets.

## Purpose

The purpose of TripletAI is to streamline the process of managing supervised learning triplets, ensuring that no two actions from different users are taken on the same triplet simultaneously. This is achieved through real-time updates and locking mechanisms.

## Functionality

- **Add or Edit Triplets**: Users can add new triplets or edit existing ones.
- **View Locked Triplets**: Users can view triplets that are locked by other users to avoid conflicts.
- **Real-time Updates**: The application uses `socket.io` for real-time updates to ensure that all users have the latest information.
- **Embla Carousel**: The application uses the Embla Carousel to display triplets in a user-friendly manner.

## Setup Instructions

### Prerequisites

- Node.js (>= 18.18)
- npm or yarn or pnpm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/tripletai.git
   cd tripletai
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:

```env
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
```

4. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Standout Features

- **Real-time Updates**: The application uses `liveblocks` to provide real-time updates, ensuring that all users have the latest information.
- **Embla Carousel**: The application uses the Embla Carousel to display triplets in a user-friendly manner.
- **Locking Mechanism**: The application ensures that no two actions from different users are taken on the same triplet simultaneously by locking triplets that are being edited.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
