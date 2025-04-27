import React, { useState } from "react";
import {
  Dialog,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player/lazy';

export default function Player({ open, onClose, video }) {
  // 字幕表示の有無
  const [displaySubtitles, setDisplaySubtitles] = useState(false);
  // 英語字幕
  const [subtitle, setSubtitle] = useState("");
  // 翻訳字幕
  const [translation, setTranslation] = useState("");

  // 時間のフォーマット
  const formatTime = (seconds) => {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor(seconds % 3600 / 60);
    const sec = Math.floor(seconds % 60);

    if (hour !== 0) {
      return `${hour}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    } else if (min !== 0) {
      return `${min}:${sec.toString().padStart(2, '0')}`;
    } else {
      return `${sec.toString()}s`;
    }
  };

  // 動画再生時字幕表示
  const handleOnPlay = () => {
    setDisplaySubtitles(true);
  };

  // 動画再生時字幕非表示
  const handleOnPause = () => {
    setDisplaySubtitles(false);
  };

  // 動画再生中の処理
  const handleProgress = (state) => {
    const formattedTime = formatTime(state.playedSeconds);
    if (video?.subtitles[formattedTime]) {
      setSubtitle(video?.subtitles[formattedTime].subtitle);
      setTranslation(video?.subtitles[formattedTime].translation);
    }
  };

  // 字幕をクリア
  const clearSubtiles = () => {
    setSubtitle("");
    setTranslation("");
    setDisplaySubtitles(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{ height: "101dvh" }}
    >
      <Box sx={{ position: "relative" }}>
        {/* 動画画面を閉じるボタン */}
        <Box
          sx={{
            position: "absolute",
            top: 11,
            left: 11,
            color: "white",
            background: "rgba(0, 0, 0, 0.4)",
            borderRadius: "50%",
            zIndex: 10000
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => {
              clearSubtiles();
              onClose();
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
          }}
        >
          {/* 動画プレイヤー */}
          <ReactPlayer
            url={`https://youtu.be/${video?.id}`}
            width={"100%"}
            height={"100dvh"}
            controls={true}
            onPlay={handleOnPlay}
            onPause={handleOnPause}
            onProgress={handleProgress}
          />
          {/* 字幕 */}
          {displaySubtitles && (
            <Box
              sx={{
                position: 'absolute',
                bottom: "0",
                width: "100%",
                textAlign: "center",
                background: "rgba(0, 0, 0, 0.4)",
                paddingY: 1
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "110%",
                  color: "white"
                }}
              >
                {subtitle}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "70%",
                  color: "rgb(255, 255, 255, 0.8)"
                }}
              >
                {translation}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog >
  );
}
