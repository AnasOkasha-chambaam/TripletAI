import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { motion, PanInfo, useAnimation } from "framer-motion";
import {
  ArrowDown,
  CheckCircle,
  DownloadCloudIcon,
  Edit,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TestSingleTripletCard from "./shared/TestSingleTripletCard";
import { TStep } from "./SingleSubSectionOfHowItWorks";

export function StepVisual({ index }: { step: TStep; index: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusToApply, setStatusToApply] = useState<
    "accepted" | "rejected" | "skipped" | null
  >(null);
  const [isTripletLoading, setIsTripletLoading] = useState(false);

  const controls = useAnimation();
  const iconControls = {
    right: useAnimation(),
    left: useAnimation(),
    up: useAnimation(),
    down: useAnimation(),
  };

  useEffect(() => {
    if (statusToApply) {
      setIsTripletLoading(true);
      setTimeout(() => {
        setIsTripletLoading(false);
        setStatusToApply(null);
      }, 2000);
    }
  }, [statusToApply]);

  const handleSwipe = async (direction: string) => {
    let newStatus = "";
    switch (direction) {
      case "right":
        setStatusToApply("accepted");
        newStatus = "accepted";
        toast.success("Triplet accepted!");
        break;
      case "left":
        setStatusToApply("rejected");
        newStatus = "rejected";
        toast.error("Triplet rejected!");
        break;
      case "up":
        // setIsDialogOpen(true);
        toast.info("Edit the triplet!");
        return;
      case "down":
        setStatusToApply("skipped");
        toast.warning("Triplet skipped!");
        return;
    }

    if (newStatus) {
      controls.start({ x: 0, y: 0 });
    }
  };

  const handleDragEnd = (_: MouseEvent, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? "right" : "left");
    } else if (Math.abs(info.offset.y) > threshold) {
      handleSwipe(info.offset.y > 0 ? "down" : "up");
    } else {
      controls.start({ x: 0, y: 0 });
    }
    Object.values(iconControls).forEach((control) =>
      control.start({ scale: 1, opacity: 0 })
    );
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  switch (index) {
    case 0:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg shadow-lg text-center w-full"
        >
          <h4 className="text-3xl font-bold mb-1 text-white">Triplet AI</h4>
          <p className="text-xl mb-4  text-white">
            Streamline Your AI Training Data
          </p>
          <SignedIn>
            <Button variant={"secondary"} asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"outline"}>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </motion.div>
      );
    case 1:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TestSingleTripletCard
            triplet={{
              _id: "example",
              id: "example",
              input: "Example Input",
              output: "Example Output",
              instruction: "Example Instruction",
              status: "accepted",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
            onSelect={() => {}}
            isLoading={false}
          />
        </motion.div>
      );
    case 2:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Supported formats: CSV, JSON
            </p>
          </div>
        </motion.div>
      );
    case 3:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-80 h-80"
        >
          <div
            className={cn("absolute inset-0 flex items-center justify-center", {
              "pointer-events-none": isTripletLoading,
            })}
          >
            <div className="relative group cursor-grab active:cursor-grabbing">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="relative z-30 group"
              >
                <TestSingleTripletCard
                  triplet={{
                    _id: "swipe",
                    id: "swipe",
                    input: "Swipe me!",
                    output: "Take an action",
                    instruction: "Swipe in any direction",
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }}
                  isLoading={isTripletLoading}
                />
              </motion.div>
              <SwipeIcon icon={CheckCircle} text="Accept" position="right" />
              <SwipeIcon icon={XCircle} text="Reject" position="left" />
              <SwipeIcon icon={Edit} text="Edit" position="up" />
              <SwipeIcon icon={ArrowDown} text="Skip" position="down" />
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter your email for 50% off!</DialogTitle>
                <DialogDescription>
                  Get a special discount on our premium features by entering
                  your email.
                </DialogDescription>
              </DialogHeader>
              <Input type="email" placeholder="your@email.com" />
              <Button onClick={() => setIsDialogOpen(false)}>
                Get Discount
              </Button>
            </DialogContent>
          </Dialog>
        </motion.div>
      );
    case 4:
      return (
        <div className="space-y-4">
          <AnimatedNotification text="View Triplets locked by other users." />

          <AnimatedNotification text="Request a Triplet." />
        </div>
      );
    case 5:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <DownloadCloudIcon className="size-28  opacity-25" />
        </motion.div>
      );
    default:
      return null;
  }
}

function SwipeIcon({
  icon: Icon,
  text,
  position,
}: {
  icon: typeof ArrowDown | typeof CheckCircle | typeof Edit | typeof XCircle;
  text: string;
  position: "right" | "left" | "up" | "down";
}) {
  const positionClasses = {
    right: "top-1/2 -right-4 transform md:translate-x-full -translate-y-1/2",
    left: "top-1/2 -left-4 transform md:-translate-x-full -translate-y-1/2",
    up: "-top-4 left-1/2 transform -translate-x-1/2 -translate-y-full",
    down: "-bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full",
  };

  const colorClasses = {
    right: "bg-green-700 outline-green-700",
    left: "bg-red-700 outline-red-700",
    up: "bg-blue-700 outline-blue-700",
    down: "bg-yellow-700 outline-yellow-700",
  };

  return (
    <div
      className={`absolute z-40 md:z-20 size-20 font-bold ${colorClasses[position]} border-muted border-4 outline flex flex-col justify-center items-center gap-2 text-muted text-sm rounded-[50%] opacity-0 group-hover:opacity-75 group-active:opacity-90 pointer-events-none transition-opacity ${positionClasses[position]}`}
    >
      <Icon className="size-5" /> {text}
    </div>
  );
}

function AnimatedNotification({ text }: { text: string }) {
  return (
    <motion.div
      // initial={{ opacity: 0, y: 200 }}
      // animate={{ opacity: 1, y: 0 }}
      className={`border-l-4 w-80 bg-muted text-muted-foreground p-4`}
    >
      <p>{text}</p>
    </motion.div>
  );
}
