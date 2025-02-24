# YouTube Translation Player (YTTP)

## 概要

スマホ上で、Chrome拡張機能「[Language Reactor](https://www.languagereactor.com/)」の機能を利用するためのWebアプリケーション。

[https://ky0ta168.github.io/yttp/](https://ky0ta168.github.io/yttp/)

## 使い方

1. PCのChrome拡張機能「Language Reactor」でYouTube動画の翻訳データをExcelで出力
2. YouTube動画のID、およびタイトルをメモ
    - YouTube動画のIDは、`https://www.youtube.com/watch?v=4Az9x5nkTTs`の場合`4Az9x5nkTTs`など
    - 共有からURLを取得した場合は、`https://youtu.be/4Az9x5nkTTs`のようなURLになるので注意
3. GoogleDriveなどを利用し、翻訳データのExcelをスマホでダウンロード
4.  YouTube Translation Player (YTTP)にアクセスし、「Save video」を押下
5. ID、タイトル、翻訳データのExcelを入力し、「Save」を押下
6. 動画のサムネイルを押下することで、動画が翻訳字幕ありで視聴

## 補足

保存した動画はブラウザのローカルストレージに保存されます。

そのため、ブラウザや別端末ではデータの共有はできません。
