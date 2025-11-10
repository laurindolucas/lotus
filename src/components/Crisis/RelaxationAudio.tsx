import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Play, Pause, Volume2 } from "lucide-react";

const audios = [
  {
    id: 1,
    title: "Som Relaxante - Pássaros Cantando",
    description: "Sons relaxantes da natureza com pássaros",
    duration: "10:00",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Demo audio
  },
];

export const RelaxationAudio = () => {
  const [currentAudio, setCurrentAudio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = (audioId: number, url: string) => {
    if (currentAudio === audioId && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (currentAudio !== audioId) {
        audioRef.current?.pause();
        audioRef.current = new Audio(url);
        setCurrentAudio(audioId);
      }
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <Card className="shadow-soft border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-accent" />
          Áudios de Relaxamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {audios.map((audio) => (
          <div
            key={audio.id}
            className="p-4 rounded-lg bg-gradient-wellness border border-accent/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shrink-0">
                <Volume2 className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-accent-foreground mb-1">
                  {audio.title}
                </h3>
                <p className="text-sm text-accent-foreground/80 mb-1">
                  {audio.description}
                </p>
                <p className="text-xs text-accent-foreground/60">{audio.duration}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-3"
              onClick={() => handlePlayPause(audio.id, audio.url)}
            >
              {currentAudio === audio.id && isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Reproduzir
                </>
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
