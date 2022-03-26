//管理用の変数
TYRANO.kag.stat.f.eval_scenario = {};
TYRANO.kag.stat.f.eval_scenario.base_scenario_name = "";
TYRANO.kag.stat.f.eval_scenario.base_scenario_current_order_index = 0;
TYRANO.kag.stat.f.eval_scenario.isDoing = false;
TYRANO.kag.stat.f.eval_scenario.eval_scenario = "";

///関数の実装
TYRANO.kag.eval_scenario = {};

//文字列に書かれたシナリオを無理やり実行する
TYRANO.kag.eval_scenario.evalScenario = function (
    scenario_text,
    storage = undefined,
    target = undefined
) {
    if (target) {
        if (!storage) {
            storage = TYRANO.kag.stat.current_scenario;
        }
        scenario_text +=
            "\n[es_jump storage='" + storage + "' target='" + target + "' ]\n";
    }
    scenario_text += "\n[end_eval_scenario]\n";
    TYRANO.kag.stat.f.eval_scenario.eval_scenario = scenario_text;
    if (!TYRANO.kag.stat.f.eval_scenario.isDoing) {
        TYRANO.kag.stat.f.eval_scenario.base_scenario_name =
            TYRANO.kag.stat.current_scenario;
        TYRANO.kag.stat.f.eval_scenario.base_scenario_current_order_index =
            TYRANO.kag.ftag.current_order_index;
    }
    TYRANO.kag.stat.is_strong_stop = false;

    let result_obj = TYRANO.kag.parser.parseScenario(scenario_text);
    let tag_obj = result_obj.array_s;
    let map_label = result_obj.map_label;

    TYRANO.kag.stat.map_label = map_label;

    TYRANO.kag.layer.showEventLayer();
    TYRANO.kag.ftag.buildTag(tag_obj);

    TYRANO.kag.stat.f.eval_scenario.isDoing = true;
};

//evalScenarioの終了
TYRANO.kag.eval_scenario.endEvalScenario = function () {
    if (TYRANO.kag.stat.f.eval_scenario.isDoing) {
        let insert = {
            name: "text",
            pm: {
                val: "",
                backlog: "join",
            },
            val: "",
        };
        TYRANO.kag.ftag.nextOrderWithIndex(
            TYRANO.kag.stat.f.eval_scenario.base_scenario_current_order_index,
            TYRANO.kag.stat.f.eval_scenario.base_scenario_name,
            true,
            insert,
            "yes"
        );
        TYRANO.kag.stat.f.eval_scenario.isDoing = false;
        TYRANO.kag.stat.f.eval_scenario.eval_scenario = "";
        TYRANO.kag.stat.f.eval_scenario.base_scenario_name = "";
        TYRANO.kag.stat.f.eval_scenario.base_scenario_current_order_index = 0;
    }
};

//セーブデータ復旧時の動作を書き換える。書き換えたのは最後のほうだけ。
TYRANO.kag.menu.loadGameData = function (data, options) {
    var auto_next = "no";

    //普通のロードの場合
    if (typeof options == "undefined") {
        options = { bgm_over: "false" };
    } else if (typeof options.bgm_over == "undefined") {
        options["bgm_over"] = "false";
    }

    if (options.auto_next) {
        auto_next = options.auto_next;
    }

    //Live2Dモデルがある場合の後始末
    if (typeof Live2Dcanvas != "undefined") {
        for (model_id in Live2Dcanvas) {
            if (Live2Dcanvas[model_id]) {
                Live2Dcanvas[model_id].check_delete = 2;
                Live2D.deleteBuffer(Live2Dcanvas[model_id].modelno);
                delete Live2Dcanvas[model_id];
            }
        }
    }

    //layerの復元
    this.kag.layer.setLayerHtml(data.layer);

    //バックログの初期化
    //awakegame考慮もれ。一旦戻す
    //this.kag.variable.tf.system.backlog = [];

    //ステータスの設定、ディープに設定する
    this.kag.stat = data.stat;

    //ステータスがストロングストップの場合
    if (this.kag.stat.is_strong_stop == true) {
        auto_next = "stop";
    } else {
        //停止の場合は復活
        this.kag.stat.is_strong_stop = false;
    }

    //タイトルの復元
    this.kag.setTitle(this.kag.stat.title);

    //一旦音楽と効果音は全て止めないと

    //BGMを引き継ぐかどうか。
    if (options.bgm_over == "false") {
        //全BGMを一旦止める
        var map_se = this.kag.tmp.map_se;
        for (var key in map_se) {
            if (map_se[key]) {
                this.kag.ftag.startTag("stopse", {
                    stop: "true",
                    buf: key,
                });
            }
        }

        var map_bgm = this.kag.tmp.map_bgm;
        for (var key in map_bgm) {
            this.kag.ftag.startTag("stopbgm", {
                stop: "true",
                buf: key,
            });
        }

        //音楽再生
        if (this.kag.stat.current_bgm != "") {
            var mstorage = this.kag.stat.current_bgm;

            var pm = {
                loop: "true",
                storage: mstorage,
                html5: this.kag.stat.current_bgm_html5,
                /*fadein:"true",*/
                /*time:2000,*/
                stop: "true",
            };

            //ボリュームが設定されいる場合
            if (this.kag.stat.current_bgm_vol != "") {
                pm["volume"] = this.kag.stat.current_bgm_vol;
            }

            this.kag.ftag.startTag("playbgm", pm);
        }

        //効果音再生
        for (key in this.kag.stat.current_se) {
            var pm_obj = this.kag.stat.current_se[key];
            pm_obj["stop"] = "true";
            this.kag.ftag.startTag("playse", pm_obj);
        }
    }

    //読み込んだCSSがある場合
    $("head").find("._tyrano_cssload_tag").remove();
    if (this.kag.stat.cssload) {
        for (file in this.kag.stat.cssload) {
            var style =
                '<link class="_tyrano_cssload_tag" rel="stylesheet" href="' +
                $.escapeHTML(file) +
                "?" +
                Math.floor(Math.random() * 10000000) +
                '">';
            $("head link:last").after(style);
        }
    } else {
        this.kag.stat.cssload = {};
    }

    if (!this.kag.stat.current_bgmovie) {
        this.kag.stat.current_bgmovie = {
            storage: "",
            volume: "",
        };
    }

    //カメラ設定を復旧 ///////////////
    if (this.kag.config.useCamera == "true") {
        $(".layer_camera").css({
            "-animation-name": "",
            "-animation-duration": "",
            "-animation-play-state": "",
            "-animation-delay": "",
            "-animation-iteration-count": "",
            "-animation-direction": "",
            "-animation-fill-mode": "",
            "-animation-timing-function": "",
        });

        for (key in this.kag.stat.current_camera) {
            var a3d_define = {
                frames: {
                    "0%": {
                        trans: this.kag.stat.current_camera[key],
                    },
                    "100%": {
                        trans: this.kag.stat.current_camera[key],
                    },
                },

                config: {
                    duration: "5ms",
                    state: "running",
                    easing: "ease",
                },

                complete: function () {
                    //特に処理なし
                },
            };

            //アニメーションの実行
            if (key == "layer_camera") {
                $(".layer_camera").css(
                    "-webkit-transform-origin",
                    "center center"
                );
                setTimeout(function () {
                    $(".layer_camera").a3d(a3d_define);
                }, 1);
            } else {
                $("." + key + "_fore").css(
                    "-webkit-transform-origin",
                    "center center"
                );
                setTimeout(function () {
                    $("." + key + "_fore").a3d(a3d_define);
                }, 1);
            }
        }
    }
    ///////////カメラここまで

    //どの道動画削除。
    $(".tyrano_base").find("video").remove();
    this.kag.tmp.video_playing = false;

    //背景動画が設定中なら
    if (this.kag.stat.current_bgmovie["storage"] != "") {
        var vstorage = this.kag.stat.current_bgmovie["storage"];
        var volume = this.kag.stat.current_bgmovie["volume"];

        var pm = {
            storage: vstorage,
            volume: volume,
            stop: "true",
        };

        this.kag.tmp.video_playing = false;

        this.kag.ftag.startTag("bgmovie", pm);
    }

    //カメラが設定中なら
    if (this.kag.stat.current_bgcamera != "") {
        this.kag.stat.current_bgcamera["stop"] = "true";
        this.kag.ftag.startTag("bgcamera", this.kag.stat.current_bgcamera);
    }

    //3Dモデルの復元/////////////////////////////////////////////
    var three = data.three;
    if (three.stat.is_load == true) {
        this.kag.stat.is_strong_stop = true;
        var init_pm = three.stat.init_pm;

        this.kag.ftag.startTag("3d_close", {});

        //setTimeout((e)=>{

        init_pm["next"] = "false";
        this.kag.ftag.startTag("3d_init", init_pm);

        var models = three.models;

        var scene_pm = three.stat.scene_pm;
        scene_pm["next"] = "false";

        this.kag.ftag.startTag("3d_scene", scene_pm);

        for (var key in models) {
            var model = models[key];
            var pm = model.pm;

            pm["pos"] = model.pos;
            pm["rot"] = model.rot;
            pm["scale"] = model.scale;
            pm["_load"] = "true";

            var tag = pm._tag;

            if (key == "camera") {
                tag = "3d_camera";
            }

            pm["next"] = "false";

            this.kag.ftag.startTag(tag, pm);
        }

        //ジャイロの復元
        var gyro = three.stat.gyro;
        if (gyro.enable == 1) {
            //復活させる。
            var gyro_pm = gyro.pm;
            gyro_pm["next"] = "false";
            this.kag.ftag.startTag("3d_gyro", gyro_pm);
        }

        if (three.stat.canvas_show) {
            this.kag.tmp.three.j_canvas.show();
        } else {
            this.kag.tmp.three.j_canvas.hide();
        }

        this.kag.tmp.three.stat = three.stat;
        this.kag.tmp.three.evt = three.evt;

        //イベントが再開できるかどうか。

        this.kag.stat.is_strong_stop = false;

        //},10);
    }

    /////////////////////////////////////////////

    //カーソルの復元
    this.kag.setCursor(this.kag.stat.current_cursor);

    //メニューボタンの状態
    if (this.kag.stat.visible_menu_button == true) {
        $(".button_menu").show();
    } else {
        $(".button_menu").hide();
    }

    //イベントの復元
    $(".event-setting-element").each(function () {
        var j_elm = $(this);
        var kind = j_elm.attr("data-event-tag");
        var pm = JSON.parse(j_elm.attr("data-event-pm"));
        var event_tag = object(tyrano.plugin.kag.tag[kind]);
        event_tag.setEvent(j_elm, pm);
    });

    //ジャンプ
    //data.stat.current_scenario;
    //data.current_order_index;
    //必ず、ファイルロード。別シナリオ経由的な
    //this.kag.ftag.startTag("call",{storage:"make.ks"});

    //auto_next 一旦makeを経由するときに、auto_nextを考えておく
    //alert(auto_next);

    var insert = {
        name: "call",
        pm: {
            storage: "make.ks",
            auto_next: auto_next,
        },
        val: "",
    };

    //auto_next = "yes";

    //make.ks を廃止したい
    //var insert =undefined;

    //添付変数は消す。
    this.kag.clearTmpVariable();

    //この辺を書き換えました。(箱詰九分)
    if (TYRANO.kag.stat.f.eval_scenario.isDoing) {
        TYRANO.kag.stat.is_strong_stop = false;
        console.log(TYRANO.kag.ftag.current_order_index);
        let result_obj = TYRANO.kag.parser.parseScenario(
            TYRANO.kag.stat.f.eval_scenario.eval_scenario
        );
        let tag_obj = result_obj.array_s;
        let map_label = result_obj.map_label;
        TYRANO.kag.stat.map_label = map_label;

        TYRANO.kag.layer.showEventLayer();
        TYRANO.kag.ftag.array_tag = tag_obj;
        TYRANO.kag.ftag.current_order_index = data.current_order_index - 1;
        TYRANO.kag.ftag.nextOrder();
    } else {
        this.kag.ftag.nextOrderWithIndex(
            data.current_order_index,
            data.stat.current_scenario,
            true,
            insert,
            "yes"
        );
    }
};

//タグの実装
//eval_scenario : 文字列に書かれたシナリオを無理やり実行する。
(function () {
    TYRANO.kag.tag.eval_scenario = {
        vital: ["exp"],
        pm: {
            exp: "",
            storage: null,
            target: null,
        },
        start: function (pm) {
            console.log(pm.exp);
            let result = "" + TYRANO.kag.embScript(pm.exp);
            TYRANO.kag.eval_scenario.evalScenario(
                result,
                pm.storage,
                pm.target
            );
        },
    };
    TYRANO.kag.ftag.master_tag.eval_scenario = object(
        TYRANO.kag.tag.eval_scenario
    );
    TYRANO.kag.ftag.master_tag.eval_scenario.kag = TYRANO.kag;
})();

//end_eval_scenario : eval_scenarioの終了。元の場所に復帰する。
(function () {
    TYRANO.kag.tag.end_eval_scenario = {
        vital: [],
        pm: {},
        start: function (pm) {
            TYRANO.kag.eval_scenario.endEvalScenario();
        },
    };
    TYRANO.kag.ftag.master_tag.end_eval_scenario = object(
        TYRANO.kag.tag.end_eval_scenario
    );
    TYRANO.kag.ftag.master_tag.end_eval_scenario.kag = TYRANO.kag;
})();

//es_jump : eval_scenario中に使えるジャンプ命令。storageが指定されていれば、eval_scenarioを強制終了し、targetに飛ぶ。
(function () {
    TYRANO.kag.tag.es_jump = {
        pm: {
            storage: null,
            target: null, //ラベル名
            countpage: true,
        },

        start: function (pm) {
            var that = this;
            //ジャンプ直後のwt などでフラグがおかしくなる対策
            setTimeout(function () {
                if (TYRANO.kag.stat.f.eval_scenario.isDoing) {
                    TYRANO.kag.stat.f.eval_scenario.isDoing = false;
                    TYRANO.kag.stat.f.eval_scenario.eval_scenario = "";
                    TYRANO.kag.stat.f.eval_scenario.base_scenario_name = "";
                    TYRANO.kag.stat.f.eval_scenario.base_scenario_current_order_index = 0;
                    if (pm.storage) {
                        TYRANO.kag.stat.current_scenario = null;
                    }
                }
                TYRANO.kag.ftag.nextOrderWithLabel(pm.target, pm.storage);
            }, 1);
        },
    };
    TYRANO.kag.ftag.master_tag.es_jump = object(TYRANO.kag.tag.es_jump);
    TYRANO.kag.ftag.master_tag.es_jump.kag = TYRANO.kag;
})();

//es_glink : glink の eval_scenario バージョン
(function () {
    TYRANO.kag.tag.es_glink = {
        pm: {
            color: "black", //クラス名でいいよ
            font_color: "",
            storage: null,
            target: null,
            name: "",
            text: "",
            x: "auto",
            y: "",
            width: "",
            height: "",
            size: 30,
            graphic: "",
            enterimg: "",
            cm: "true",
            clickse: "",
            enterse: "",
            leavese: "",
            face: "",
            exp: "",
        },

        //イメージ表示レイヤ。メッセージレイヤのように扱われますね。。
        //cmで抹消しよう
        start: function (pm) {
            var that = TYRANO;
            var target_layer = null;
            target_layer = TYRANO.kag.layer.getFreeLayer();
            target_layer.css("z-index", 999999);

            var j_button = $("<div class='glink_button'>" + pm.text + "</div>");
            j_button.css("position", "absolute");
            j_button.css("cursor", "pointer");
            j_button.css("z-index", 99999999);
            j_button.css("font-size", pm.size + "px");

            if (pm.font_color != "") {
                j_button.css("color", $.convertColor(pm.font_color));
            }

            if (pm.height != "") {
                j_button.css("height", pm.height + "px");
            }

            if (pm.width != "") {
                j_button.css("width", pm.width + "px");
            }

            //graphic 背景画像を指定できます。
            if (pm.graphic != "") {
                //画像の読み込み

                j_button.removeClass("glink_button").addClass("button_graphic");
                var img_url = "./data/image/" + pm.graphic;
                j_button.css("background-image", "url(" + img_url + ")");
                j_button.css("background-repeat", "no-repeat");
                j_button.css("background-position", "center center");
                j_button.css("background-size", "100% 100%");
            } else {
                j_button.addClass(pm.color);
            }

            if (pm.face != "") {
                j_button.css("font-family", pm.face);
            } else if (that.kag.stat.font.face != "") {
                j_button.css("font-family", that.kag.stat.font.face);
            }

            if (pm.x == "auto") {
                var sc_width = parseInt(that.kag.config.scWidth);
                var center = Math.floor(parseInt(j_button.css("width")) / 2);
                var base = Math.floor(sc_width / 2);
                var first_left = base - center;
                j_button.css("left", first_left + "px");
            } else if (pm.x == "") {
                j_button.css("left", TYRANO.kag.stat.locate.x + "px");
            } else {
                j_button.css("left", pm.x + "px");
            }

            if (pm.y == "") {
                j_button.css("top", TYRANO.kag.stat.locate.y + "px");
            } else {
                j_button.css("top", pm.y + "px");
            }

            //オブジェクトにクラス名をセットします
            $.setName(j_button, pm.name);

            that.kag.event.addEventElement({
                tag: "glink",
                j_target: j_button, //イベント登録先の
                pm: pm,
            });
            this.setEvent(j_button, pm);

            target_layer.append(j_button);
            target_layer.show();
            this.kag.ftag.nextOrder();
        },

        setEvent: function (j_button, pm) {
            var that = TYRANO;

            (function () {
                var _target = pm.target;
                var _storage = pm.storage;
                var _pm = pm;
                var preexp = that.kag.embScript(pm.preexp);
                var button_clicked = false;

                j_button.click(function (e) {
                    //クリックされた時に音が指定されていたら
                    if (_pm.clickse != "") {
                        that.kag.ftag.startTag("playse", {
                            storage: _pm.clickse,
                            stop: true,
                        });
                    }

                    //Sタグに到達していないとクリッカブルが有効にならない fixの時は実行される必要がある
                    if (that.kag.stat.is_strong_stop != true) {
                        return false;
                    }

                    button_clicked = true;

                    if (_pm.exp != "") {
                        //eval_scenario実行
                        let result = "" + TYRANO.kag.embScript(_pm.exp);
                        TYRANO.kag.eval_scenario.evalScenario(
                            result,
                            _storage,
                            _target
                        );
                    }

                    if (pm.cm == "true") {
                        that.kag.ftag.startTag("cm", {});
                    }

                    //選択肢の後、スキップを継続するか否か
                    if (that.kag.stat.skip_link == "true") {
                        e.stopPropagation();
                    } else {
                        that.kag.stat.is_skip = false;
                    }
                });

                j_button.hover(
                    function () {
                        if (_pm.enterimg != "") {
                            var enterimg_url = "./data/image/" + _pm.enterimg;
                            j_button.css(
                                "background-image",
                                "url(" + enterimg_url + ")"
                            );
                        }

                        //マウスが乗った時
                        if (_pm.enterse != "") {
                            that.kag.ftag.startTag("playse", {
                                storage: _pm.enterse,
                                stop: true,
                            });
                        }
                    },
                    function () {
                        if (_pm.enterimg != "") {
                            var img_url = "./data/image/" + _pm.graphic;
                            j_button.css(
                                "background-image",
                                "url(" + img_url + ")"
                            );
                        }
                        //マウスが乗った時
                        if (_pm.leavese != "") {
                            that.kag.ftag.startTag("playse", {
                                storage: _pm.leavese,
                                stop: true,
                            });
                        }
                    }
                );
            })();
        },
    };
    TYRANO.kag.ftag.master_tag.es_glink = object(TYRANO.kag.tag.es_glink);
    TYRANO.kag.ftag.master_tag.es_glink.kag = TYRANO.kag;
})();

//es_button : button の eval_scenario バージョン。role, savesnap パラメータは存在しません。
(function () {
    TYRANO.kag.tag.es_button = {
        pm: {
            graphic: "",
            storage: null,
            target: null,
            ext: "",
            name: "",
            x: "",
            y: "",
            width: "",
            height: "",
            fix: "false" /*ここがtrueの場合、システムボタンになりますね*/,
            folder: "image",
            exp: "",
            prevar: "",
            visible: "true",
            hint: "",
            clickse: "",
            enterse: "",
            leavese: "",
            clickimg: "",
            enterimg: "",

            auto_next: "yes",
        },

        //イメージ表示レイヤ。メッセージレイヤのように扱われますね。。
        //cmで抹消しよう
        start: function (pm) {
            var that = TYRANO;

            var target_layer = null;

            if (pm.fix == "false") {
                target_layer = this.kag.layer.getFreeLayer();
                target_layer.css("z-index", 999999);
            } else {
                target_layer = this.kag.layer.getLayer("fix");
            }

            var storage_url = "";

            if ($.isHTTP(pm.graphic)) {
                storage_url = pm.graphic;
            } else {
                storage_url = "./data/" + pm.folder + "/" + pm.graphic;
            }

            var j_button = $("<img />");
            j_button.attr("src", storage_url);
            j_button.css("position", "absolute");
            j_button.css("cursor", "pointer");
            j_button.css("z-index", 99999999);

            //初期状態で表示か非表示か
            if (pm.visible == "true") {
                j_button.show();
            } else {
                j_button.hide();
            }

            if (pm.x == "") {
                j_button.css("left", this.kag.stat.locate.x + "px");
            } else {
                j_button.css("left", pm.x + "px");
            }

            if (pm.y == "") {
                j_button.css("top", this.kag.stat.locate.y + "px");
            } else {
                j_button.css("top", pm.y + "px");
            }

            if (pm.fix != "false") {
                j_button.addClass("fixlayer");
            }

            if (pm.width != "") {
                j_button.css("width", pm.width + "px");
            }

            if (pm.height != "") {
                j_button.css("height", pm.height + "px");
            }

            //ツールチップの設定
            if (pm.hint != "") {
                j_button.attr({
                    title: pm.hint,
                    alt: pm.hint,
                });
            }

            //オブジェクトにクラス名をセットします
            $.setName(j_button, pm.name);

            //クラスとイベントを登録する
            that.kag.event.addEventElement({
                tag: "button",
                j_target: j_button, //イベント登録先の
                pm: pm,
            });
            this.setEvent(j_button, pm);

            target_layer.append(j_button);

            if (pm.fix == "false") {
                target_layer.show();
            }

            this.kag.ftag.nextOrder();
        },

        setEvent: function (j_button, pm) {
            var that = TYRANO;

            (function () {
                var _target = pm.target;
                var _storage = pm.storage;
                var _pm = pm;

                var preexp = that.kag.embScript(pm.preexp);
                var button_clicked = false;

                j_button.hover(
                    function () {
                        //マウスが乗った時
                        if (_pm.enterse != "") {
                            that.kag.ftag.startTag("playse", {
                                storage: _pm.enterse,
                                stop: true,
                            });
                        }

                        if (_pm.enterimg != "") {
                            var enter_img_url = "";
                            if ($.isHTTP(_pm.enterimg)) {
                                enter_img_url = _pm.enterimg;
                            } else {
                                enter_img_url =
                                    "./data/" + _pm.folder + "/" + _pm.enterimg;
                            }

                            $(this).attr("src", enter_img_url);
                        }
                    },
                    function () {
                        //マウスが外れた時
                        if (_pm.leavese != "") {
                            that.kag.ftag.startTag("playse", {
                                storage: _pm.leavese,
                                stop: true,
                            });
                        }

                        //元に戻す
                        if (_pm.enterimg != "") {
                            var enter_img_url = "";
                            if ($.isHTTP(_pm.graphic)) {
                                enter_img_url = _pm.graphic;
                            } else {
                                enter_img_url =
                                    "./data/" + _pm.folder + "/" + _pm.graphic;
                            }

                            $(this).attr("src", enter_img_url);
                        }
                    }
                );

                j_button.click(function (event) {
                    if (_pm.clickimg != "") {
                        var click_img_url = "";
                        if ($.isHTTP(_pm.clickimg)) {
                            click_img_url = _pm.clickimg;
                        } else {
                            click_img_url =
                                "./data/" + _pm.folder + "/" + _pm.clickimg;
                        }

                        j_button.attr("src", click_img_url);
                    }

                    //fix指定のボタンは、繰り返し実行できるようにする
                    if (button_clicked == true && _pm.fix == "false") {
                        return false;
                    }

                    //Sタグに到達していないとクリッカブルが有効にならない fixの時は実行される必要がある
                    if (
                        that.kag.stat.is_strong_stop != true &&
                        _pm.fix == "false"
                    ) {
                        return false;
                    }

                    button_clicked = true;

                    if (_pm.exp != "") {
                        //eval_scenario実行
                        let result = "" + TYRANO.kag.embScript(_pm.exp);
                        TYRANO.kag.eval_scenario.evalScenario(
                            result,
                            _storage,
                            _target
                        );
                    }

                    if (_pm.fix == "false") {
                        that.kag.ftag.startTag("cm", {});
                    }

                    //画面効果中は実行できないようにする
                    if (
                        that.kag.layer.layer_event.css("display") == "none" &&
                        that.kag.stat.is_strong_stop != true
                    ) {
                        return false;
                    }

                    //クリックされた時に音が指定されていたら
                    if (_pm.clickse != "") {
                        that.kag.ftag.startTag("playse", {
                            storage: _pm.clickse,
                            stop: true,
                        });
                    }

                    //選択肢の後、スキップを継続するか否か
                    if (that.kag.stat.skip_link == "true") {
                        event.stopPropagation();
                    } else {
                        that.kag.stat.is_skip = false;
                    }
                });
            })();
        },
    };
    TYRANO.kag.ftag.master_tag.es_button = object(TYRANO.kag.tag.es_button);
    TYRANO.kag.ftag.master_tag.es_button.kag = TYRANO.kag;
})();

//es_clickable : clickable の eval_scenario バージョン。exp パラメータが追加されている。
(function () {
    TYRANO.kag.tag.es_clickable = {
        vital: ["width", "height"],

        pm: {
            width: "0",
            height: "0",
            x: "",
            y: "",
            border: "none",
            color: "",
            mouseopacity: "",
            opacity: "140",
            storage: null,
            target: null,
            name: "",
            exp: "",
        },

        //イメージ表示レイヤ。メッセージレイヤのように扱われますね。。
        //cmで抹消しよう
        start: function (pm) {
            var that = TYRANO;

            //this.kag.stat.locate.x
            var layer_free = this.kag.layer.getFreeLayer();

            layer_free.css("z-index", 9999999);

            var j_button = $("<div />");
            j_button.css("position", "absolute");
            j_button.css("cursor", "pointer");
            j_button.css("top", this.kag.stat.locate.y + "px");
            j_button.css("left", this.kag.stat.locate.x + "px");
            j_button.css("width", pm.width + "px");
            j_button.css("height", pm.height + "px");
            j_button.css("opacity", $.convertOpacity(pm.opacity));
            j_button.css("background-color", $.convertColor(pm.color));
            j_button.css("border", $.replaceAll(pm.border, ":", " "));

            //alert($.replaceAll(pm.border,":"," "));

            //x,y 座標が指定されている場合は、そっちを採用
            if (pm.x != "") {
                j_button.css("left", parseInt(pm.x));
            }

            if (pm.y != "") {
                j_button.css("top", parseInt(pm.y));
            }

            //クラスとイベントを登録する
            that.kag.event.addEventElement({
                tag: "clickable",
                j_target: j_button, //イベント登録先の
                pm: pm,
            });

            this.setEvent(j_button, pm);

            layer_free.append(j_button);
            layer_free.show();

            this.kag.ftag.nextOrder();
        },

        setEvent: function (j_button, pm) {
            var that = TYRANO;

            (function () {
                var _target = pm.target;
                var _storage = pm.storage;
                var _pm = pm;

                if (_pm.mouseopacity != "") {
                    j_button.bind("mouseover", function () {
                        j_button.css(
                            "opacity",
                            $.convertOpacity(_pm.mouseopacity)
                        );
                    });

                    j_button.bind("mouseout", function () {
                        j_button.css("opacity", $.convertOpacity(_pm.opacity));
                    });
                }

                j_button.click(function () {
                    //Sタグに到達していないとクリッカブルが有効にならない

                    var is_s = (function (obj) {
                        if (obj.kag.stat.is_strong_stop != true) {
                            return false;
                        }

                        return true;
                    })(that);

                    if (is_s == false) {
                        return false;
                    }

                    that.kag.ftag.startTag("cm", {});
                    if (_pm.exp != "") {
                        //eval_scenario実行
                        let result = "" + TYRANO.kag.embScript(_pm.exp);
                        TYRANO.kag.eval_scenario.evalScenario(
                            result,
                            _storage,
                            _target
                        );
                    }
                });
            })();
        },
    };
    TYRANO.kag.ftag.master_tag.es_clickable = object(
        TYRANO.kag.tag.es_clickable
    );
    TYRANO.kag.ftag.master_tag.es_clickable.kag = TYRANO.kag;
})();
