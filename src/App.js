import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid2,
  Box,
  Avatar,
  AppBar,
  Menu,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Player from "./components/Player";
import SaveVideo from "./components/SaveVideo";
import { getVideoDataList } from "./utils/index"

export default function App() {
  // 保存済み動画リスト
  const [videoDataList, setVideoDataList] = useState([])
  // 動画プレイヤーの開閉
  const [openPlayer, setOpenPlayer] = useState(false)
  // 再生する動画
  const [selectedVideo, setSelectedVideo] = useState(null)
  // 動画保存フォームの開閉
  const [openSaveForm, setOpenSaveForm] = useState(false)
  // 動画のメニューの開閉
  const [openMenu, setOpenMenu] = useState(false)
  // メニューのアンカー
  const [anchorEl, setAnchorEl] = useState(null);
  // 削除する動画
  const [selectedRemoveVideo, setSelectedRemoveVideo] = useState(null)

  // 動画プレイヤーを開く
  const handleOpenPlayer = (video) => {
    setSelectedVideo(video)
    setOpenPlayer(true)
  }

  // 動画プレイヤーを閉じる
  const handleClosePlayer = () => {
    setSelectedVideo(null)
    setOpenPlayer(false)
  }

  // 動画保存フォームの開く
  const handleOpenSaveForm = () => {
    setOpenSaveForm(true)
  }

  // 動画保存フォームの閉じる
  const handleCloseSaveForm = () => {
    setOpenSaveForm(false)
  }

  // 動画メニューを開く
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true)
  };

  // 動画メニューを閉じる
  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false)
  };

  // 動画を削除
  const removeVideoData = () => {
    const videoId = selectedRemoveVideo.id
    const list = videoDataList.slice().filter(data =>
      data.id !== videoId
    )
    // 保存
    setVideoDataList(list)
    window.localStorage.setItem("videoDataList", JSON.stringify(list))
  }

  useEffect(() => {
    // ローカルストレージから動画データを取得
    setVideoDataList(getVideoDataList())
  }, [])

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
            textTransform: "none"
          }}
          onClick={() => handleOpenSaveForm()}
        >
          Save video
        </Button>
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
          <Grid2 item key={index} sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                marginX: 1,
                marginTop: 1,
              }}
            >
              {/* サムネイル */}
              <Avatar
                variant="square"
                src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                sx={{
                  width: "50%",
                  height: "auto",
                  objectFit: "contain",
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenPlayer(video)}
              />
              {/* 動画タイトル・動画ID */}
              <Box
                sx={{
                  paddingLeft: 1,
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenPlayer(video)}
              >
                <Typography variant="body2">{video.title}</Typography>
                <Typography variant="caption" color="textSecondary">{video.id}</Typography>
              </Box>
              {/* 操作メニュー */}
              <Box
              >
                <MoreVertIcon
                  fontSize='small'
                  onClick={(event) => {
                    handleMenuClick(event)
                    setSelectedRemoveVideo(video)
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
              removeVideoData()
            }
            setOpenMenu(false)
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

