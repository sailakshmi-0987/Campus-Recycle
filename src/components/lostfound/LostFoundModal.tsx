import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";

export default function LostFoundModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { addLostFound } = useData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [kind, setKind] = useState<"lost" | "found">("lost");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const uploadImage = async (file: File): Promise<string | undefined> => {
    if (!file) return undefined;

    const fileExt = file.name.split(".").pop();
    const fileName = `lostfound-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("item-images")
      .upload(`lostfound/${fileName}`, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("item-images")
      .getPublicUrl(`lostfound/${fileName}`);

    return data.publicUrl;
  };

  const submit = async () => {
    if (!user) return toast.error("Sign in to report");
    if (!title.trim()) return toast.error("Enter a title");

    setSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      await addLostFound({
        userId: user.id,
        title: title.trim(),
        description,
        imageUrl,
        location,
        kind,
      });

      toast.success("Report submitted");
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Report Lost / Found Item</h3>

        <div className="grid gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Item Title"
            className="border rounded-lg px-3 py-2"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded-lg px-3 py-2"
          />

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location Found / Lost"
            className="border rounded-lg px-3 py-2"
          />

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50">
            <ImagePlus size={26} className="text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">
              {image ? image.name : "Upload an image"}
            </span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <div className="flex gap-3">
            <button
              className={`flex-1 px-3 py-2 rounded-lg border ${
                kind === "lost"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setKind("lost")}
            >
              Lost
            </button>
            <button
              className={`flex-1 px-3 py-2 rounded-lg border ${
                kind === "found"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setKind("found")}
            >
              Found
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
