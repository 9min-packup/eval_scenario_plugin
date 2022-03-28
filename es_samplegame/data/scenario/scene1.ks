*start
[cm  ]
[clearfix]
[start_keyconfig]
[bg storage="room.jpg" time="100"]
;メニューボタンの表示
@showmenubutton
;メッセージウィンドウの設定
[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]
;文字が表示される領域を調整
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]
;メッセージウィンドウの表示
@layopt layer=message0 visible=true
;キャラクターの名前が表示される文字領域
[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]
;上記で定義した領域がキャラクターの名前表示であることを宣言（これがないと#の部分でエラーになります）
[chara_config ptext="chara_name_area"]
;このゲームで登場するキャラクターを宣言
;akane
[chara_new  name="akane" storage="chara/akane/normal.png" jname="あかね"  ]
;キャラクターの表情登録
[chara_face name="akane" face="angry" storage="chara/akane/angry.png"]
[chara_face name="akane" face="doki" storage="chara/akane/doki.png"]
[chara_face name="akane" face="happy" storage="chara/akane/happy.png"]
[chara_face name="akane" face="sad" storage="chara/akane/sad.png"]

;yamato
[chara_new  name="yamato"  storage="chara/yamato/normal.png" jname="やまと" ]
;キャラクターの表情登録
[chara_face name="yamato" face="angry" storage="chara/yamato/angry.png"]
[chara_face name="yamato" face="tohoho" storage="chara/yamato/tohoho.png"]
[chara_face name="yamato" face="happy" storage="chara/yamato/happy.png"]
[chara_face name="yamato" face="sad" storage="chara/yamato/sad.png"]

[iscript]
    f.akane_in = false;
    f.yamato_in = false;
    f.call_dareka = false;
    f.moji = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の",
                "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "が", "ぎ", "ぐ", "げ", "ご",
                "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "きゃ", "きゅ", "きょ",
                "しゃ", "しゅ", "しょ", "ちゃ", "ちゅ", "ちょ", "にゃ", "にゅ", "にょ", "ひゃ", "ひゅ", "ひょ", "みゃ", "みゅ", "みょ", "りゃ", "りゅ", "りょ", "じぇ", "ちぇ", "てぃ",
                "ふぁ", "ふぃ", "ふぇ", "ー"];
    f.moji_ka = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ",
                "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン", "ガ", "ギ", "グ", "ゲ", "ゴ",
                "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ", "キャ", "キュ", "キョ",
                "シャ", "シュ", "ショ", "チャ", "チュ", "チョ", "ニャ", "ニュ", "ニョ", "ヒャ", "ヒュ", "ヒョ", "ミャ", "ミュ", "ミョ", "リャ", "リュ", "リョ", "ジェ", "チェ", "ティ",
                "ファ", "フィ", "フェ", "ー"];
    f.moji_kan = ["赤", "紅", "橙", "黄", "緑", "青", "紫", "白", "黒", "灰", "人", "金", "銀", "飯", "円", "亜", "仏", "神", "肉", "骨", "魂", "善", "悪", "宝", "石", "玉", "形",
                  "物", "者", "銃", "刀", "汁", "竜", "水", "火", "炎", "草", "雷", "土", "空", "雲", "風", "馬", "犬", "豚", "猫", "餅", "牛", "羊", "鳥", "鶏"];

    f.akane_in_sentences = [
        { s: "やっほー！元気？",  param : []},
        { s: "こんにちは。私はあかね。",  param : []},
    ];
    f.akane_out_sentences = [
        { s: "さようなら。",  param : []},
        { s: "じゃあね。",  param : []},
    ];
    f.akane_sentences = [
        { s: "#には文学的価値が結構あると思う。私が言うんだから、間違いない！",  param : ["#"]},
        { s: "#と$って結構似てると思うんだよね...どうかな...?",  param : ["#", "$"]},
        { s: "君ってけっこう#だよね。そういうとこ、嫌いじゃないよ。",  param : ["#"]},
        { s: "やまと君に#を塗りたくろうと思うんだけど、怒られるかな...?",  param : ["#"]},
    ];

    f.yamato_in_sentences = [
        { s: "よう。元気か？",  param : []},
        { s: "こんにちは。俺はやまと。",  param : []},
    ];
    f.yamato_out_sentences = [
        { s: "グッバイ。アディオス...",  param : []},
        { s: "じゃあな。達者でな。",  param : []},
    ];
    f.yamato_sentences = [
        { s: "#って何だ...?聞いたことないな...",  param : ["#"]},
        { s: "#と$が衝突するとき、世界は滅ぶと言われている。...知らんけど。",  param : ["#", "$"]},
        { s: "おまえってけっこう#だよな。まあ、そういうやつもいるよな。",  param : ["#"]},
        { s: "昨日、紅茶に#を入れたらうまかったぜ。",  param : ["#"]},
    ];

    f.bg_list = ["room.jpg", "rouka.jpg"];

    f.scenario = "";

[endscript]

*auto_scenario

[iscript]
    let rand_range = function(min, max) {
        return Math.floor( Math.random() * (max + 1 - min) ) + min ;
    };

    let new_word = function(){
        let word = "";
        let type = rand_range(0, 2);
        if(type == 0)  {
            let word_len = rand_range(2, 8);
            for(let i = 0; i < word_len; i++) {
                if(i == 0) {
                    word += f.moji[rand_range(0, f.moji.length - 2)];
                } else {
                    word += f.moji[rand_range(0, f.moji.length - 1)];
                }
            }
        }else if(type == 1){
            let word_len = rand_range(2, 8);
            for(let i = 0; i < word_len; i++) {
                if(i == 0) {
                    word += f.moji_ka[rand_range(0, f.moji_ka.length - 2)];
                } else {
                    word += f.moji_ka[rand_range(0, f.moji_ka.length - 1)];
                }
            }
        } else {
            let word_len = rand_range(1, 6);
            for(let i = 0; i < word_len; i++) {
                word += f.moji_kan[rand_range(0, f.moji_kan.length - 1)];
            }
        }
        return word;
    };

    let speak = function(jname, sentences) {
        let tag_name = "\n#" + jname + "\n";
        let sentence = sentences[rand_range(0, sentences.length -1)];
        let s = sentence.s;
        for (let i = 0; i < sentence.param.length; i++) {
            s = s.replace( sentence.param[i], new_word() );
        }
        return tag_name + s + "[p]\n";
    };

    let chara_move = function(name) {
        let top = rand_range(300, parseInt(TYRANO.kag.config.scHeight)) - 600;
        let left = rand_range(200, parseInt(TYRANO.kag.config.scWidth)) - 400;
        let angleX = rand_range(0, 360);
        let angleY = rand_range(0, 360);
        let angleZ = rand_range(0, 360);
        let tag_chara_move = "[chara_move  name='"+ name +"'  wait='false' top='"+ top +"' left='"+ left +"'  ]\n"
        let tag_round = "[keyframe name='round']\n[frame p='100%' rotateX='"+ angleX +"deg' rotateY='"+ angleY +"deg' rotateY='"+ angleX +"deg' ]\n[endkeyframe]\n[kanim name='"+ name +"' keyframe='round' time='600' ]\n"
        return tag_chara_move + tag_round;
    };

    let chara_show = function(name) {
        return "[chara_show  name='"+ name +"' ]\n";
    };

    let chara_hide = function(name) {
        return "[chara_hide  name='"+ name +"' ]\n";
    };
    
    let chara_mod = function(name) {
        let face;
        let a = rand_range(0, 4) 
        if(a == 0) {
            face = "happy";
        } else if(a == 1) {
            face = "angry";
        } else if(a == 2) {
            face = "sad";
        } else if(a == 3) {
            if(name == "akane") {
                face = "doki";
            } else if(name == "yamato") {
               face = "tohoho";
            } else {
               face = "default";
            }
        } else {
            face = "default";
        }
        let reflect = (rand_range(0,1 ) == 0) ? "false" : "true";

        return "[chara_mod  name='"+ name +"' face='"+ face +"' reflect='"+ reflect +"' ]\n";
    };

    let bg = function (){
        let storage = f.bg_list[rand_range(0, f.bg_list.length - 1)];
        return "[bg storage='"+ storage +"' time='100']\n"
    }

    f.scenario = "";
    f.sub_scenario = "";

    if(rand_range(0,8) == 8 ){
        f.scenario += bg();
    }

    if ( f.akane_in == false && f.yamato_in == false && f.call_dareka == false) {
        f.sub_scenario = "";
        f.call_dareka = true;
        let a = rand_range(0,1);
        if(a == 0) {
           f.scenario = "[es_glink  color='blue'  size='28'  x='360'  width='500'  y='250'  text='おーい！' exp='f.sub_scenario' storage='scene1.ks'  target='*auto_scenario' ]\n[s]";
        } else {
           f.scenario = "[es_glink  color='blue'  size='28'  x='360'  width='500'  y='250'  text='...誰かおる？' exp='f.sub_scenario' storage='scene1.ks'  target='*auto_scenario' ]\n[s]";
        }
    } else if ( f.akane_in == false && f.yamato_in == false && f.call_dareka == true) {
        let a = rand_range(0,1);
        if(a == 0) {
            //あかね登場
            f.akane_in = true;
            f.scenario += chara_show("akane");
            f.scenario += speak("あかね", f.akane_in_sentences);
        } else {
            //やまと登場
            f.yamato_in = true;
            f.scenario += chara_show("yamato");
            f.scenario += speak("やまと", f.yamato_in_sentences);
        }
        f.call_dareka = false;
    } else {
        f.call_dareka = false;
        let break_flag = false;
        if(break_flag == false && f.akane_in == false) {
            let a = rand_range(0,3);
            if(a == 3) {
                //あかね登場
                f.akane_in = true;
                f.scenario += chara_show("akane");
                f.scenario += speak("あかね", f.akane_in_sentences);
                break_flag = true;
            }
        } 
        if(break_flag == false && f.yamato_in == false) {
            let a = rand_range(0,3);
            if(a == 3) {
                //やまと登場
                f.yamato_in = true;
                f.scenario += chara_show("yamato");
                f.scenario += speak("やまと", f.yamato_in_sentences);
                break_flag = true;
            }
        } 
        if(break_flag == false && f.akane_in == true) {
            let a = rand_range(0,7);
            if(a == 7) {
                //あかね退場
                f.akane_in = false;
                f.scenario += speak("あかね", f.akane_out_sentences);
                f.scenario += "\n# \n";
                f.scenario += chara_hide("akane");
                break_flag = true;
            }
        } 
        if(break_flag == false && f.yamato_in == true) {
            let a = rand_range(0,7);
            if(a == 7) {
                //やまと退場
                f.yamato_in = false;
                f.scenario += speak("やまと", f.yamato_out_sentences);
                f.scenario += "# \n";
                f.scenario += chara_hide("yamato");
                break_flag = true;
            }
        } 
        if(break_flag == false) {
            if( f.akane_in == true && f.yamato_in == true ) {
                let a = rand_range(0,1);
                if(a == 0 ) {
                    //あかね動作
                    f.scenario += chara_move("akane");
                    f.scenario += chara_mod("akane");
                    let b = rand_range(0, 2);
                    for(let i = 0; i <= b; i++) { 
                        f.scenario += speak("あかね", f.akane_sentences);
                    }
                    break_flag = true;
                } else {
                    //やまと動作
                    f.scenario += chara_move("yamato");
                    f.scenario += chara_mod("yamato");
                    let b = rand_range(0, 2);
                    for(let i = 0; i <= b; i++) { 
                        f.scenario += speak("やまと", f.yamato_sentences);
                    }
                    break_flag = true;
                }
            } else if(f.akane_in == true ){
                 //あかね動作
                f.scenario += chara_move("akane");
                f.scenario += chara_mod("akane");
                let b = rand_range(0, 2);
                for(let i = 0; i <= b; i++) { 
                    f.scenario += speak("あかね", f.akane_sentences);
                }
                break_flag = true;
            } else if(f.yamato_in == true ){
                //やまと動作
                f.scenario += chara_move("yamato");
                f.scenario += chara_mod("yamato");
                let b = rand_range(0, 2);
                for(let i = 0; i <= b; i++) { 
                    f.scenario += speak("やまと", f.yamato_sentences);
                }
                break_flag = true;
            } else {            
                //ここにくるときは何かおかしい
                f.akane_in = false;
                f.yamato_in = false;
                f.call_dareka = false;
                f.scenario = "[chara_hide_all]\n";
            }
        }
    }
[endscript]

[eval_scenario exp="f.scenario" storage="scene1.ks"  target="*auto_scenario"]

[s]