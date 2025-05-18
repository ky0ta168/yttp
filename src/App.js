import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Button,
  Grid2,
  Box,
  Avatar,
  AppBar,
  Menu,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Player from "./components/Player";
import SaveVideo from "./components/SaveVideo";
import { getVideoDataList } from "./utils/index";

export default function App() {
  // 保存済み動画リスト
  const [videoDataList, setVideoDataList] = useState([]);
  // 動画プレイヤーの開閉
  const [openPlayer, setOpenPlayer] = useState(false);
  // 再生する動画
  const [selectedVideo, setSelectedVideo] = useState(null);
  // 動画保存フォームの開閉
  const [openSaveForm, setOpenSaveForm] = useState(false);
  // 動画のメニューの開閉
  const [openMenu, setOpenMenu] = useState(false);
  // メニューのアンカー
  const [anchorEl, setAnchorEl] = useState(null);
  // 削除する動画
  const [selectedRemoveVideo, setSelectedRemoveVideo] = useState(null);
  // ファイルinputタグのリファレンス
  const fileInputRef = useRef(null);

  // 動画プレイヤーを開く
  const handleOpenPlayer = (video) => {
    setSelectedVideo(video);
    setOpenPlayer(true);
  };

  // 動画プレイヤーを閉じる
  const handleClosePlayer = () => {
    setSelectedVideo(null);
    setOpenPlayer(false);
  };

  // 動画保存フォームの開く
  const handleOpenSaveForm = () => {
    setOpenSaveForm(true);
  };

  // 動画保存フォームの閉じる
  const handleCloseSaveForm = () => {
    setOpenSaveForm(false);
  };

  // 動画メニューを開く
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  // 動画メニューを閉じる
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  // 動画を削除
  const removeVideoData = () => {
    const videoId = selectedRemoveVideo.id;
    const list = videoDataList.slice().filter(data =>
      data.id !== videoId
    );
    // 保存
    setVideoDataList(list);
    window.localStorage.setItem("videoDataList", JSON.stringify(list));
  };

  // 動画のデータをJSONファイルで保存
  const handleExport = () => {
    exportLocalStorageToFile();
  };

  // ローカルストレージをファイルとして出力
  const exportLocalStorageToFile = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        data[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        data[key] = localStorage.getItem(key);
      }
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "videolist.json";
    a.click();

    // メモリ解放
    URL.revokeObjectURL(url);
  };

  const handleButtonClick = () => {
    // inputをプログラムでクリック
    fileInputRef.current?.click();
  };

  // ファイル読み込み
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result);

        if (typeof json !== "object" || json === null) {
          alert("Invalid JSON format.");
          return;
        }

        if (window.confirm(`Do you want to load "${file.name}"?`)) {
          for (const [key, value] of Object.entries(json)) {
            const stringValue =
              typeof value === "string" ? value : JSON.stringify(value);
            localStorage.setItem(key, stringValue);
          }
          // ステートの更新
          setVideoDataList(getVideoDataList());
        }
      } catch (err) {
        alert("Failed to parse JSON: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    // ローカルストレージから動画データを取得
    setVideoDataList(getVideoDataList());
  }, []);

  return (
    <React.Fragment>

      {/* ヘッダー */}
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          padding: 1,
          paddingY: 1,
          color: "black",
          backgroundColor: "white",
          borderBottom: "0.5px solid rgb(0, 0, 0, 0.2)"
        }}
      >
        <Typography variant="h6">
          YouTube Translation Player
        </Typography>
      </AppBar>

      {/* メニューボタン */}
      <Box
        sx={{ paddingTop: 1, paddingLeft: 1, marginTop: 6, }}
      >
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          sx={{
            marginRight: 1,
            marginBottom: 0.5,
            textTransform: "none"
          }}
          onClick={() => handleOpenSaveForm()}
        >
          Save video
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          sx={{
            marginRight: 1,
            marginBottom: 0.5,
            textTransform: "none"
          }}
          onClick={() => handleExport()}
        >
          Export video list
        </Button>
        <Button
          color="inherit"
          variant="outlined"
          size="small"
          sx={{
            marginRight: 1,
            marginBottom: 0.5,
            textTransform: "none"
          }}
          onClick={handleButtonClick}
        >
          Import video list
        </Button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // 非表示
        />
        {/* <Button
          color="inherit"
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none"
          }}
        >
          Help
        </Button> */}
      </Box>

      {/* 動画リスト */}
      <Grid2 container direction="row" spacing={0} sx={{ marginBottom: 1 }}>
        {videoDataList.map((video, index) => (
          <Grid2 item key={index} sx={{ maxWidth: '1024px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginX: 1,
                marginY: 0.5,
              }}
            >
              <Grid2 container direction="row">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleOpenPlayer(video)}
                >
                  {/* サムネイル */}
                  <Avatar
                    variant="square"
                    src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                    sx={{
                      width: "50% ",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                  {/* 動画タイトル・動画ID */}
                  <Box
                    sx={{
                      paddingLeft: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="body2">{video.title}</Typography>
                    <Typography variant="caption" color="textSecondary">{video.id}</Typography>
                  </Box>
                </Box>
              </Grid2>
              {/* 操作メニュー */}
              <Box
              >
                <MoreVertIcon
                  fontSize='small'
                  onClick={(event) => {
                    handleMenuClick(event);
                    setSelectedRemoveVideo(video);
                  }}
                  sx={{
                    cursor: 'pointer',
                  }}
                />
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>

      {/* 動画プレイヤー */}
      <Player open={openPlayer} onClose={handleClosePlayer} video={selectedVideo} />

      {/* 動画保存フォーム */}
      <SaveVideo
        open={openSaveForm}
        onClose={handleCloseSaveForm}
        handleSetVideoDataList={setVideoDataList} />

      {/* 動画操作メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
      >
        <Box
          sx={{
            paddingX: 1.5,
            cursor: 'pointer',
          }}
          onClick={() => {
            if (window.confirm(`Do you want to remove "${selectedRemoveVideo.title}"?`)) {
              removeVideoData();
            }
            setOpenMenu(false);
          }}
        >
          <Typography variant="body2">
            Remove
          </Typography>
        </Box>
      </Menu>

    </React.Fragment >
  );
}

