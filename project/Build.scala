import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "cs-awp"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    "org.webjars" %% "webjars-play" % "2.1.0-3",
    "org.webjars" % "bootstrap" % "2.3.2",
    "org.webjars" % "jquery" % "2.0.3-1",
    jdbc,
    anorm
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
