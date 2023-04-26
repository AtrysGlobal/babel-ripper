# Babel Ripper Changelog

## [1.0.9] - 2023-04-26

### Added

- Repository is now under GNU General Public License.
- Repository change history documentation.
- New function for babel ripper tool `get` intended as an option to `getTranslations` function for more syntactic and less redundant code.
- `BabelProxyService` configuration parameters: `apiAddress` and `clientTimeout` to allow consumer client to have more control over the communication configuration with Babel.

### Changed

- To instantiate the `BabelProxyService` class it is mandatory to specify a babel API address, together with its API Key.
- Updated unit tests.
- Improved source code documentation.

