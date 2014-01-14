package controllers

import play.api.mvc.{Action, Controller}
import play.api.libs.EventSource
import play.api.libs.json._
import play.api.libs.iteratee.{Concurrent, Enumeratee}
import models.ChatBot

/**
 * Chat controller for serving messages.
 * Handle both incoming and outgoing messages.
 *
 * @author fdziedzic
 *         Date 29.10.13
 *         Time 16:35
 */
object ChatApplication extends Controller {

  case class Msg(room: String, user: String, msg: String, time: String)

  implicit val msgFormat = Json.format[Msg]

  /** Central hub for distributing chat messages */
  val (chatOut, chatChannel) = Concurrent.broadcast[JsValue]

  /** Controller action serving chat page */
  def index = Action {
    Ok(views.html.index("Chat with Server Side Events - Advanced Web Programming"))
  }

  /** Controller action for POSTing chat messages */
  def postMessage = Action(parse json) {
    req =>
      req.body.validate[Msg].map {
        case msg => {
          if (msg.user.trim.size != 0) {
            val escaped = Msg(msg.room,
              xml.Utility.escape(msg.user),
              xml.Utility.escape(msg.msg),
              xml.Utility.escape(msg.time)
            )
            chatChannel push Json.toJson(escaped)
            chatChannel push ChatBot.talk(msg.room, msg.msg)
            Ok(Json.obj("status" -> "ok"))
          } else {
            BadRequest(Json.obj("status" -> "error: user cannot be empty"))
          }
        }
      }.recoverTotal {
        e => BadRequest(Json.obj("status" -> "error"))
      }
  }

  /** Enumeratee for filtering messages based on room */
  def filter(room: String) = Enumeratee.filter[JsValue] {
    json: JsValue => (json \ "room").as[String] == room
  }

  /** Controller action serving activity based on room */
  def chatFeed(room: String) = Action {
    Ok.stream(chatOut &> filter(room) &> EventSource()).as("text/event-stream")
  }

}
