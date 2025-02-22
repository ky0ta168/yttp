// LocalStorageのvideoDataListを取得
export const getVideoDataList = () => {
    const videoDataList = window.localStorage.getItem("videoDataList")
    if (videoDataList) {
        return JSON.parse(videoDataList)
    }

    // 存在しない場合は、空配列を返却
    return []
}
