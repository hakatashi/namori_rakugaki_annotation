# namori_rakugaki_animation

なもり先生がTwitterにアップロードしている「最近のらくがき」に対するキャラクター名・作品名のアノテーションデータ

* [namori.csv](namori.csv)

## フォーマット

CSV形式です。

```
tweet_id,media_id,image_url,character_name,character_ruby,work_name
```

* character_name
  * キャラ名です。
  * 名字と名前の間に「・」「=」もしくは半角空白が挿入されます。
  * 原則として最もポピュラーな名前のみを掲載していますが、複数の名前がありポピュラーさが区別できない場合は読点で区切っています (character_rubyも同様)。
* character_ruby
  * character_nameの読み仮名です。
* work_name
  * 作品名です。
  * ハンバーガーちゃんの作品名は「ハンバーガーちゃん」です。
