import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    isShuffling: false,
    repeatMode: 'OFF',
    shuffledQueue: [],

    toggleShuffle: () => {
        const { isShuffling, queue, currentSong } = get();
        if (!isShuffling) {
            const currentSongIndex = queue.findIndex(song => song.id === currentSong?.id);
            const remainingSongs = [...queue];
            if (currentSongIndex !== -1) {
                remainingSongs.splice(currentSongIndex, 1);
            }
            for (let i = remainingSongs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
            }
            const shuffledQueue = currentSong ? [currentSong, ...remainingSongs] : remainingSongs;
            set({
                isShuffling: true,
                shuffledQueue,
                currentIndex: 0,
            });
        } else {
            const currentSongIndex = queue.findIndex(song => song.id === currentSong?.id);
            set({
                isShuffling: false,
                shuffledQueue: [],
                currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0,
            });
        }
    },

    toggleRepeat: () => {
        set(state => {
            let nextMode = 'OFF';
            if (state.repeatMode === 'OFF') nextMode = 'ONE';
            else if (state.repeatMode === 'ONE') nextMode = 'ALL';
            return { repeatMode: nextMode };
        });
    },

    initializeQueue: (songs) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
            shuffledQueue: [],
            isShuffling: false,
        });
    },

    playAlbum: (songs, startIndex = 0) => {
        if (songs.length === 0) return;
        const song = songs[startIndex];
        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
            shuffledQueue: [],
            isShuffling: false,
        });
    },

    setCurrentSong: (song) => {
        if (!song) return;
        const { isShuffling, queue, shuffledQueue } = get();
        const songIndex = isShuffling
            ? shuffledQueue.findIndex((s) => s.id === song.id)
            : queue.findIndex((s) => s.id === song.id);

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        });
    },

    togglePlay: () => {
        set(state => ({ isPlaying: !state.isPlaying }));
    },

    playNext: () => {
        const { isShuffling, queue, shuffledQueue, currentIndex, repeatMode } = get();
        const list = isShuffling ? shuffledQueue : queue;
        let nextIndex = currentIndex + 1;
        if (nextIndex >= list.length) {
            if (repeatMode === 'ALL') nextIndex = 0;
            else return;
        }
        set({
            currentSong: list[nextIndex],
            currentIndex: nextIndex,
            isPlaying: true,
        });
    },

    playPrevious: () => {
        const { isShuffling, queue, shuffledQueue, currentIndex, repeatMode } = get();
        const list = isShuffling ? shuffledQueue : queue;
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            if (repeatMode === 'ALL') prevIndex = list.length - 1;
            else return;
        }
        set({
            currentSong: list[prevIndex],
            currentIndex: prevIndex,
            isPlaying: true,
        });
    },
}));