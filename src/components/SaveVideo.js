import React, { useState } from "react";
import {
    Dialog,
    Grid2,
    IconButton,
    Box,
    Stack,
    TextField,
    Button,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from "xlsx"
import { getVideoDataList } from "../utils";


function SaveVideo({ open, onClose, handleSetVideoDataList }) {
    // 動画ID
    const [videoId, setVideoId] = useState("");
    // 動画タイトル
    const [videoTitle, setVideoTitle] = useState("")
    // ファイル名
    const [fileName, setFileName] = useState(null);
    // 字幕データ
    const [subtitles, setSubtitles] = useState(null);

    // ファイル処理
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: "array" })

                // 最初のシートを取得
                const sheet = workbook.Sheets[workbook.SheetNames[0]]
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })

                // JSONデータを整形
                const subtitles = {}
                json.slice(1).forEach(row => {
                    const time = row[0]?.toString().trim()
                    const subtitle = row[1]?.toString().trim()
                    const translation = row[2]?.toString().trim()

                    if (time) {
                        subtitles[time] = { subtitle, translation }
                    }
                })

                setSubtitles(subtitles)
            }
        };
    }

    // 保存
    const handleSave = () => {
        // 動画データの初期化
        const subtitlesData = {
            id: videoId,
            title: videoTitle,
            subtitles: subtitles
        }

        // 保存済みの動画データを取得し、追記
        const videoDataList = getVideoDataList()
        videoDataList.push(subtitlesData)

        // 保存
        window.localStorage.setItem("videoDataList", JSON.stringify(videoDataList))

        // stateの更新
        handleSetVideoDataList(videoDataList)

        // 入力データを削除しフォームを閉じる
        clearInput()
        onClose()
    }

    // 入力データクリア
    const clearInput = () => {
        setVideoId("")
        setVideoTitle("")
        setFileName("")
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <Box>
                <Grid2
                    container
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    {/* 動画保存ボタン */}
                    <Typography sx={{ padding: 1 }}>Save video data</Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            clearInput()
                            onClose()
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Grid2>
            </Box>
            <Box sx={{ paddingX: 1, paddingBottom: 1 }}>
                <Stack spacing={1}>
                    {/* videoId 入力 */}
                    <TextField
                        label="ID"
                        variant="outlined"
                        fullWidth
                        value={videoId}
                        size="small"
                        onChange={(e) => setVideoId(e.target.value)}
                    />
                    {/* videoTitle 入力 */}
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={videoTitle}
                        size="small"
                        onChange={(e) => setVideoTitle(e.target.value)}
                    />
                    {/* ファイル選択 */}
                    <Box>
                        <input
                            type="file"
                            id="file-input"
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-input">
                            <Button
                                sx={{
                                    textTransform: "none"
                                }}
                                color="inherit"
                                variant="outlined"
                                component="span"
                                fullWidth
                            >
                                {fileName || "Select Excel file"}
                            </Button>
                        </label>
                    </Box>

                    {/* 保存ボタン */}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSave}
                        color="inherit"
                        sx={{
                            textTransform: "none"
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}

export default SaveVideo;
