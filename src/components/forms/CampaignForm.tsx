import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import getErrorMsg from "@/lib/getErrorMsg";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { ICampaign } from "@/types/campaign.types";
import { EApiRequestMethod } from "@/types/api.types";
import { Checkbox } from "../ui/checkbox";

const refundOptions = ["full", "partial", "none"] as const;

const campaignFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  donationGoal: z.number().min(1),
  tilePrice: z.number().min(0.1),
  gridSize: z.object({
    width: z.number().min(1),
    height: z.number().min(1),
  }),
  refundPolicy: z.enum(refundOptions),
  escrowEnabled: z.boolean(),
  image: z
    .instanceof(File, { message: "Upload a valid image file" })
    .optional(),
  cooldown: z.number().min(0).optional(),
  lockDuration: z.number().min(0).optional(),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

type CampaignFormProps = {
  campaign?: ICampaign | null;
  onSuccess?: () => void;
  requestUrl: string;
  requestMethod: EApiRequestMethod;
};

const CampaignForm: FC<CampaignFormProps> = ({
  campaign,
  onSuccess,
  requestUrl,
  requestMethod,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    campaign?.imageTemplateUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: campaign?.title ?? "",
      description: campaign?.description ?? "",
      donationGoal: campaign?.donationGoal ?? 1000,
      tilePrice: campaign?.tilePrice ?? 1,
      gridSize: {
        width: campaign?.gridSize.width ?? 100,
        height: campaign?.gridSize.height ?? 100,
      },
      refundPolicy: campaign?.refundPolicy ?? "full",
      escrowEnabled: campaign?.escrowEnabled ?? false,
      cooldown: campaign?.settings?.cooldown ?? undefined,
      lockDuration: campaign?.settings?.lockDuration ?? undefined,
      image: undefined as unknown as File,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (data.image) formData.append("image", data.image);

      await axiosInstance()[requestMethod](requestUrl, formData);
      toast.success("Campaign created successfully");

      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMsg(err));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Template</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={(ref) => {
                    field.ref(ref);
                    fileInputRef.current = ref;
                  }}
                />
              </FormControl>
              {previewImage && (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded mt-2"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the campaign..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Donation Goal */}
        <FormField
          control={form.control}
          name="donationGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Donation Goal ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tile Price */}
        <FormField
          control={form.control}
          name="tilePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Tile ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Grid Size */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gridSize.width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grid Width</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gridSize.height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grid Height</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Refund Policy */}
        <FormField
          control={form.control}
          name="refundPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refund Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {refundOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Escrow Toggle */}
        <FormField
          control={form.control}
          name="escrowEnabled"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enable Escrow?</FormLabel>
              <FormControl>
                <Checkbox
                  className="h-5 w-5 ml-5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional Settings */}
        <FormField
          control={form.control}
          name="cooldown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cooldown (sec, optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lockDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tile Lock Duration (sec, optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full text-lg">
          Launch Campaign
        </Button>
      </form>
    </Form>
  );
};

export default CampaignForm;
