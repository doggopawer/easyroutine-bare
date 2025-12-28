import UIKit
import React
import React_RCTAppDelegate
// import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {
    self.moduleName = "easyroutine"
    // self.dependencyProvider = RCTAppDependencyProvider()

    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    self.window.backgroundColor = UIColor.red

    return result
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(
      forBundleRoot: "index",
      fallbackExtension: nil
    )
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}