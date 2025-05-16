import { useRef, useEffect, useState } from "react";
import { ICampaign } from "@/types/campaign.types";
import Image from "next/image";
import ColorPaletteModal from "../modals/ColorPaletteModal";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { sendFakeDonation } from "@/lib/polkadot/sendFakeDonation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

type PixelCanvasProps = {
  campaign: ICampaign;
  onDonate?: (campaign: ICampaign) => void | Promise<void>;
};

const TILE_SIZE = 10;

export default function PixelCanvas({
  campaign,
  onDonate,
}: Readonly<PixelCanvasProps>) {
  const { user } = useAuthContext();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPaletteOpen, setColorPaletteOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const canvasWidth = campaign.gridSize.width * TILE_SIZE;
  const canvasHeight = campaign.gridSize.height * TILE_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Grid lines
    ctx.strokeStyle = "#eee";
    for (let x = 0; x < canvasWidth; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw previously placed tiles
    campaign.tilePlacements.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Handle clicks
    const handleClick = (e: MouseEvent) => {
      if (!user) {
        router.push("/login");
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / TILE_SIZE) * TILE_SIZE;
      const y = Math.floor((e.clientY - rect.top) / TILE_SIZE) * TILE_SIZE;
      setPos({ x, y });
      setColorPaletteOpen(true);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [campaign, canvasWidth, canvasHeight, user, router]);

  const handleDraw = async (color: string) => {
    if (!canvasRef.current || !pos) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    try {
      // send fake donation
      await sendFakeDonation();

      ctx.fillStyle = color;
      ctx.fillRect(pos.x, pos.y, TILE_SIZE, TILE_SIZE);
      setColorPaletteOpen(false);
      setPos(null);

      // notify backend
      const res = await axiosInstance().post(
        `/api/campaigns/${campaign._id}/donate`,
        {
          x: pos.x / TILE_SIZE,
          y: pos.y / TILE_SIZE,
          color,
        }
      );
      if (onDonate) {
        await onDonate(res.data.data.doc);
      }

      toast.success("Tile placed successfully!");
    } catch (err) {
      console.error("Transaction rejected or failed:", err);
      toast.error("Failed to place tile. Please try again.");
    }
  };

  const imageUrl = campaign.imageTemplateUrl?.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );

  return (
    <>
      <div
        className="relative border mt-6 shadow"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Template"
            width={canvasWidth}
            height={canvasHeight}
            className="absolute top-0 left-0 w-full h-full object-cover opacity-30 grayscale pointer-events-none z-0"
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 block z-10"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      <ColorPaletteModal
        open={colorPaletteOpen}
        onColorSelect={handleDraw}
        onClose={() => setColorPaletteOpen(false)}
      />
    </>
  );
}
