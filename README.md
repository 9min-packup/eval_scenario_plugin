# eval_scenario プラグイン

![Image 1](image.png)

ティラノスクリプト用のプラグイン。

このプラグインは、文字列変数内に記述されたシナリオを解析して実行する[eval_scenario]タグをティラノスクリプトに追加します。セーブ・ロードにも対応しています。

例えば、以下のような場合に便利です。

-   シナリオを javascript 上で生成し、実行する。
-   探索ゲーム、脱出ゲームなどで、ものを調べた際にちょっとしたシナリオを発生させる。

eval_scenario の終了後は、元のシナリオに続きに復帰します。

## デモ

https://www.youtube.com/watch?v=droNDtFYdyc

## 解説記事

https://note.com/9min_packup/n/nd7b1f99a059e

## 導入

1. このリポジトリをダウンロードします。（右上の[code]ボタン->[Download Zip] で）
2. Zip を解凍します。
3. 解凍したフォルダ内の"eval_scenario"フォルダを、あなたのティラノスクリプトプロジェクトの"data/others/plugin/"以下にコピーします。
4. "first.ks" 内に以下を記述します。

```
[plugin name="eval_scenario"]
```

以上で導入完了です。

※ "make.ks"に何かを記述する必要はありません。

## 使い方

例えば、以下のように記載します。

```
[iscript]
    f.hoge = "[chara_show name='akane' time='1000']\n" +
             "#あかね\n" +
             "こんにちは。[p]\n" +
             "私の名前はあかね。[p]\n" +
             "[chara_mod name='akane' face='happy']\n" +
             "いえーーーい。[p]\n";
[endscript]

[eval_scenario exp="f.hoge"]

```

-   変数の中にシナリオを記述した文字列を代入してください。[eval]タグで行うと文字列が変換されてしまうので、
    [iscript]の中で記述する必要があります。
-   改行するときは改行コード'\n'を入れます。
-   文字列を'+'で連結してるのは、単に見やすさのためで、なくてもいいです。

また、以下のように、[iscript]内で直接実行することもできます。この場合、最初のタグの後ろのみ[wait]をいれてください。

```
[iscript]
    f.hoge = "[chara_show name='akane' time='1000']\n" +
             "[wait time='1000']" +
             "#あかね\n" +
             "こんにちは。[p]\n" +
             "私の名前はあかね。[p]\n" +
             "[chara_mod name='akane' face='happy']\n" +
             "いえーーーい。[p]\n";

    TYRANO.kag.eval_scenario.evalScenario(f.hoge);
[endscript]
```

余談ですが、[iscript]内で直接実行する際は、変数に代入せずにそのまま文字列を引数に渡しても大丈夫です。

```
[iscript]
    TYRANO.kag.eval_scenario.evalScenario(
             "[chara_show name='akane' time='1000']\n" +
             "[wait time='1000']" +
             "#あかね\n" +
             "こんにちは。[p]\n" +
             "私の名前はあかね。[p]\n" +
             "[chara_mod name='akane' face='happy']\n" +
             "いえーーーい。[p]\n"
        );
[endscript]
```

## タグ

### [eval_scenario]

文字列変数内に記述されたシナリオを解析して実行します。

使用できるパラメータ：

-   exp : 解析する文字列変数を指定します。

## ライセンス

MIT License

## コピーライト

Copyright 2022 箱詰九分 (@9min_packup)
