import { useState } from "react";
import AddArtistDialog from "./AddArtistDialog";
import ArtistsTable from "./ArtistsTable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

const ArtistsTabContent = () => {
  const [reload, setReload] = useState(false);
  const { fetchStats } = useMusicStore();
  const handleArtistChanged = () => {
    setReload((r) => !r);
    fetchStats();
  };
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" />
              Artists Library
            </CardTitle>
            <CardDescription>Manage your artist collection</CardDescription>
          </div>
          <AddArtistDialog onArtistAdded={handleArtistChanged} />
        </div>
      </CardHeader>
      <CardContent>
        <ArtistsTable onArtistChanged={reload} />
      </CardContent>
    </Card>
  );
};

export default ArtistsTabContent;
