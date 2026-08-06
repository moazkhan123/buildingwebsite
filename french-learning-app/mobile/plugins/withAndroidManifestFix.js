const { withAndroidManifest } = require("expo/config-plugins");

/**
 * One of our native dependencies still pulls in the legacy (pre-AndroidX)
 * com.android.support:support-compat library as a transitive dependency,
 * which conflicts with androidx.core.core during the Android manifest merge:
 *
 *   Attribute application@appComponentFactory value=(androidx.core.app.CoreComponentFactory)
 *   is also present at [com.android.support:support-compat:28.0.0] ...
 *
 * Removing the legacy dependency at its source hasn't been fully possible,
 * so we take Android's own suggested override: declare that our manifest's
 * value wins for this specific attribute.
 */
module.exports = function withAndroidManifestFix(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

    const application = manifest.application?.[0];
    if (application) {
      application.$["tools:replace"] = "android:appComponentFactory";
    }

    return config;
  });
};
