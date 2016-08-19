require 'mime/types'
require 'slim'

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# General configuration

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
end

ROOT_LOCALE = :en
SUPPORTED_LOCALES = [:en, :fr]

# Routing for pages
[:privacy, :unsubscribed].each do |page_key|
  SUPPORTED_LOCALES.each do |locale|
    path = (locale == ROOT_LOCALE) ? "/#{page_key}" : "/#{locale}/#{page_key}"
    proxy path, "/localizable/basic.html", layout: 'layout', locals: { page_key: page_key, locale: locale }, locale: locale
  end
end

activate :i18n, mount_at_root: ROOT_LOCALE, langs: SUPPORTED_LOCALES
activate :asset_hash, ignore: ['.*fontawesome.*']

# workaround for long-standing issue with ruby implementation
# of SASS (see https://github.com/sass/sass/issues/193)
class CSSImporter < ::Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end
paths = ["node_modules/selectize/dist/css"]
::Compass.configuration.sass_options = {
  load_paths: paths.map{ |p| File.join(root, p) },
  filesystem_importer: CSSImporter
}

activate :external_pipeline,
  name: :browserify,
  command: "./node_modules/.bin/#{build? ? :browserify : :watchify} --transform babelify --extension=\".js\" source/javascripts/homepage.js -o .js-dist/compiled.js",
  source: ".js-dist",
  latency: 1

activate :s3_sync do |s3_sync|
  s3_sync.bucket                     = 'champaign-homepage' # The name of the S3 bucket you are targeting. This is globally unique.
  s3_sync.region                     = 'us-west-2'     # The AWS region for your bucket.
  s3_sync.aws_access_key_id          = $AWS_ACCESS_KEY_ID
  s3_sync.aws_secret_access_key      = $AWS_SECRET_ACCESS_KEY
  s3_sync.delete                     = false # We delete stray files by default.
  s3_sync.after_build                = false # We do not chain after the build step by default.
  s3_sync.prefer_gzip                = true
  s3_sync.path_style                 = true
  s3_sync.reduced_redundancy_storage = false
  s3_sync.acl                        = 'public-read'
  s3_sync.encryption                 = false
  s3_sync.prefix                     = ''
  s3_sync.version_bucket             = false
  s3_sync.index_document             = 'index.html'
  s3_sync.error_document             = '404.html'
end
