package models

import com.google.code.chatterbotapi.{ChatterBotType, ChatterBotFactory, ChatterBotSession}
import play.api.libs.json.{JsValue, Json}
import controllers.ChatApplication.Msg
import java.text.SimpleDateFormat
import java.util.Date

/**
 *
 *
 * User: filip
 * Date: 26.12.13
 * Time: 19:34
 */
object ChatBot {

  var session: Option[ChatterBotSession] = None

  def talk(room: String, input: String): JsValue = {
    def prepareMsg: String = {
      session match {
        case Some(b) => b.think(input)
        case None =>
          val factory = new ChatterBotFactory()
          val bot = factory.create(ChatterBotType.PANDORABOTS, "af613d175e3411cc")
          session = Option(bot.createSession())
          prepareMsg
      }
    }

    Json.toJson(Msg(room,
      "Chat bot",
      prepareMsg,
      new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date)
    ))
  }

}
