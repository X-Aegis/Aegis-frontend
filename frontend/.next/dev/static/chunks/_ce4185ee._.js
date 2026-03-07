(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/contexts/FreighterContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FreighterProvider",
    ()=>FreighterProvider,
    "useFreighter",
    ()=>useFreighter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/freighter-api/build/index.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================================
// Constants
// ============================================================================
const STORAGE_KEY = 'freighter_wallet_address';
const ERROR_MESSAGES = {
    NOT_INSTALLED: 'Freighter wallet extension is not installed. Please install it from the Chrome Web Store.',
    USER_REJECTED: 'Connection request was rejected. Please try again and approve the connection.',
    VERIFICATION_FAILED: 'Failed to verify stored connection.',
    UNKNOWN: 'An unexpected error occurred. Please try again.'
};
// ============================================================================
// Context Creation
// ============================================================================
const FreighterContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function FreighterProvider({ children }) {
    _s();
    // State management
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Connect function
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FreighterProvider.useCallback[connect]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                // Check installation
                const installed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isConnected"])();
                if (!installed) {
                    throw new Error(ERROR_MESSAGES.NOT_INSTALLED);
                }
                // Request access
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestAccess"])();
                // Get public key
                const publicKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicKey"])();
                // Update state
                setAddress(publicKey);
                setIsConnected(true);
                // Persist to localStorage
                localStorage.setItem(STORAGE_KEY, publicKey);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN;
                setError(errorMessage);
                console.error('Connection error:', err);
            } finally{
                setIsLoading(false);
            }
        }
    }["FreighterProvider.useCallback[connect]"], []);
    // Disconnect function
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FreighterProvider.useCallback[disconnect]": ()=>{
            setAddress(null);
            setIsConnected(false);
            setError(null);
            localStorage.removeItem(STORAGE_KEY);
        }
    }["FreighterProvider.useCallback[disconnect]"], []);
    // Initialization logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FreighterProvider.useEffect": ()=>{
            const initialize = {
                "FreighterProvider.useEffect.initialize": async ()=>{
                    try {
                        // Check Freighter installation
                        const installed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isConnected"])();
                        setIsInstalled(installed);
                        if (!installed) return;
                        // Check for stored address
                        const storedAddress = localStorage.getItem(STORAGE_KEY);
                        if (!storedAddress) return;
                        // Verify stored address with Freighter
                        const currentKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicKey"])();
                        if (currentKey === storedAddress) {
                            // Verification succeeded, restore state
                            setAddress(storedAddress);
                            setIsConnected(true);
                        } else {
                            // Stored key doesn't match, clear it
                            localStorage.removeItem(STORAGE_KEY);
                        }
                    } catch (err) {
                        // Verification failed, clear stored data
                        console.error('Verification error:', err);
                        localStorage.removeItem(STORAGE_KEY);
                    }
                }
            }["FreighterProvider.useEffect.initialize"];
            initialize();
        }
    }["FreighterProvider.useEffect"], []);
    // Memoize context value
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FreighterProvider.useMemo[value]": ()=>({
                address,
                isConnected,
                isInstalled,
                error,
                isLoading,
                connect,
                disconnect
            })
    }["FreighterProvider.useMemo[value]"], [
        address,
        isConnected,
        isInstalled,
        error,
        isLoading,
        connect,
        disconnect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FreighterContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/FreighterContext.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
_s(FreighterProvider, "Cc7Z0tbvfRdm/k1spmREgpCCjNU=");
_c = FreighterProvider;
function useFreighter() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(FreighterContext);
    if (context === undefined) {
        throw new Error('useFreighter must be used within a FreighterProvider');
    }
    return context;
}
_s1(useFreighter, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "FreighterProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$FreighterContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/FreighterContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$FreighterContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FreighterProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            children: children
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>J,
    "useTheme",
    ()=>z
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
var M = (e, i, s, u, m, a, l, h)=>{
    let d = document.documentElement, w = [
        "light",
        "dark"
    ];
    function p(n) {
        (Array.isArray(e) ? e : [
            e
        ]).forEach((y)=>{
            let k = y === "class", S = k && a ? m.map((f)=>a[f] || f) : m;
            k ? (d.classList.remove(...S), d.classList.add(a && a[n] ? a[n] : n)) : d.setAttribute(y, n);
        }), R(n);
    }
    function R(n) {
        h && w.includes(n) && (d.style.colorScheme = n);
    }
    function c() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (u) p(u);
    else try {
        let n = localStorage.getItem(i) || s, y = l && n === "system" ? c() : n;
        p(y);
    } catch (n) {}
};
var b = [
    "light",
    "dark"
], I = "(prefers-color-scheme: dark)", O = typeof window == "undefined", x = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0), U = {
    setTheme: (e)=>{},
    themes: []
}, z = ()=>{
    var e;
    return (e = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](x)) != null ? e : U;
}, J = (e)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](x) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, e.children) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](V, {
        ...e
    }), N = [
    "light",
    "dark"
], V = ({ forcedTheme: e, disableTransitionOnChange: i = !1, enableSystem: s = !0, enableColorScheme: u = !0, storageKey: m = "theme", themes: a = N, defaultTheme: l = s ? "system" : "light", attribute: h = "data-theme", value: d, children: w, nonce: p, scriptProps: R })=>{
    let [c, n] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "V.useState": ()=>H(m, l)
    }["V.useState"]), [T, y] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "V.useState": ()=>c === "system" ? E() : c
    }["V.useState"]), k = d ? Object.values(d) : a, S = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[S]": (o)=>{
            let r = o;
            if (!r) return;
            o === "system" && s && (r = E());
            let v = d ? d[r] : r, C = i ? W(p) : null, P = document.documentElement, L = {
                "V.useCallback[S].L": (g)=>{
                    g === "class" ? (P.classList.remove(...k), v && P.classList.add(v)) : g.startsWith("data-") && (v ? P.setAttribute(g, v) : P.removeAttribute(g));
                }
            }["V.useCallback[S].L"];
            if (Array.isArray(h) ? h.forEach(L) : L(h), u) {
                let g = b.includes(l) ? l : null, D = b.includes(r) ? r : g;
                P.style.colorScheme = D;
            }
            C == null || C();
        }
    }["V.useCallback[S]"], [
        p
    ]), f = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[f]": (o)=>{
            let r = typeof o == "function" ? o(c) : o;
            n(r);
            try {
                localStorage.setItem(m, r);
            } catch (v) {}
        }
    }["V.useCallback[f]"], [
        c
    ]), A = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "V.useCallback[A]": (o)=>{
            let r = E(o);
            y(r), c === "system" && s && !e && S("system");
        }
    }["V.useCallback[A]"], [
        c,
        e
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            let o = window.matchMedia(I);
            return o.addListener(A), A(o), ({
                "V.useEffect": ()=>o.removeListener(A)
            })["V.useEffect"];
        }
    }["V.useEffect"], [
        A
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            let o = {
                "V.useEffect.o": (r)=>{
                    r.key === m && (r.newValue ? n(r.newValue) : f(l));
                }
            }["V.useEffect.o"];
            return window.addEventListener("storage", o), ({
                "V.useEffect": ()=>window.removeEventListener("storage", o)
            })["V.useEffect"];
        }
    }["V.useEffect"], [
        f
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "V.useEffect": ()=>{
            S(e != null ? e : c);
        }
    }["V.useEffect"], [
        e,
        c
    ]);
    let Q = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "V.useMemo[Q]": ()=>({
                theme: c,
                setTheme: f,
                forcedTheme: e,
                resolvedTheme: c === "system" ? T : c,
                themes: s ? [
                    ...a,
                    "system"
                ] : a,
                systemTheme: s ? T : void 0
            })
    }["V.useMemo[Q]"], [
        c,
        f,
        e,
        T,
        s,
        a
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](x.Provider, {
        value: Q
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](_, {
        forcedTheme: e,
        storageKey: m,
        attribute: h,
        enableSystem: s,
        enableColorScheme: u,
        defaultTheme: l,
        value: d,
        themes: a,
        nonce: p,
        scriptProps: R
    }), w);
}, _ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](({ forcedTheme: e, storageKey: i, attribute: s, enableSystem: u, enableColorScheme: m, defaultTheme: a, value: l, themes: h, nonce: d, scriptProps: w })=>{
    let p = JSON.stringify([
        s,
        i,
        a,
        e,
        h,
        l,
        u,
        m
    ]).slice(1, -1);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("script", {
        ...w,
        suppressHydrationWarning: !0,
        nonce: typeof window == "undefined" ? d : "",
        dangerouslySetInnerHTML: {
            __html: `(${M.toString()})(${p})`
        }
    });
}), H = (e, i)=>{
    if (O) return;
    let s;
    try {
        s = localStorage.getItem(e) || void 0;
    } catch (u) {}
    return s || i;
}, W = (e)=>{
    let i = document.createElement("style");
    return e && i.setAttribute("nonce", e), i.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(i), ()=>{
        window.getComputedStyle(document.body), setTimeout(()=>{
            document.head.removeChild(i);
        }, 1);
    };
}, E = (e)=>(e || (e = window.matchMedia(I)), e.matches ? "dark" : "light");
;
}),
"[project]/node_modules/@stellar/freighter-api/build/index.min.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

!function(e, r) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = r() : "TURBOPACK unreachable";
}(/*TURBOPACK member replacement*/ __turbopack_context__.e, ()=>(()=>{
        "use strict";
        var e, r, E = {
            d: (e, r)=>{
                for(var o in r)E.o(r, o) && !E.o(e, o) && Object.defineProperty(e, o, {
                    enumerable: !0,
                    get: r[o]
                });
            },
            o: (e, r)=>Object.prototype.hasOwnProperty.call(e, r),
            r: (e)=>{
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(e, "__esModule", {
                    value: !0
                });
            }
        }, o = {};
        E.r(o), E.d(o, {
            default: ()=>I,
            getNetwork: ()=>N,
            getNetworkDetails: ()=>s,
            getPublicKey: ()=>_,
            getUserInfo: ()=>R,
            isAllowed: ()=>C,
            isBrowser: ()=>c,
            isConnected: ()=>n,
            requestAccess: ()=>i,
            setAllowed: ()=>O,
            signAuthEntry: ()=>S,
            signBlob: ()=>A,
            signTransaction: ()=>t
        }), function(e) {
            e.CREATE_ACCOUNT = "CREATE_ACCOUNT", e.FUND_ACCOUNT = "FUND_ACCOUNT", e.ADD_ACCOUNT = "ADD_ACCOUNT", e.IMPORT_ACCOUNT = "IMPORT_ACCOUNT", e.IMPORT_HARDWARE_WALLET = "IMPORT_HARDWARE_WALLET", e.LOAD_ACCOUNT = "LOAD_ACCOUNT", e.MAKE_ACCOUNT_ACTIVE = "MAKE_ACCOUNT_ACTIVE", e.UPDATE_ACCOUNT_NAME = "UPDATE_ACCOUNT_NAME", e.GET_MNEMONIC_PHRASE = "GET_MNEMONIC_PHRASE", e.CONFIRM_MNEMONIC_PHRASE = "CONFIRM_MNEMONIC_PHRASE", e.CONFIRM_MIGRATED_MNEMONIC_PHRASE = "CONFIRM_MIGRATED_MNEMONIC_PHRASE", e.RECOVER_ACCOUNT = "RECOVER_ACCOUNT", e.CONFIRM_PASSWORD = "CONFIRM_PASSWORD", e.REJECT_ACCESS = "REJECT_ACCESS", e.GRANT_ACCESS = "GRANT_ACCESS", e.SIGN_TRANSACTION = "SIGN_TRANSACTION", e.SIGN_BLOB = "SIGN_BLOB", e.SIGN_AUTH_ENTRY = "SIGN_AUTH_ENTRY", e.HANDLE_SIGNED_HW_TRANSACTION = "HANDLE_SIGNED_HW_TRANSACTION", e.REJECT_TRANSACTION = "REJECT_TRANSACTION", e.SIGN_FREIGHTER_TRANSACTION = "SIGN_FREIGHTER_TRANSACTION", e.SIGN_FREIGHTER_SOROBAN_TRANSACTION = "SIGN_FREIGHTER_SOROBAN_TRANSACTION", e.ADD_RECENT_ADDRESS = "ADD_RECENT_ADDRESS", e.LOAD_RECENT_ADDRESSES = "LOAD_RECENT_ADDRESSES", e.SIGN_OUT = "SIGN_OUT", e.SHOW_BACKUP_PHRASE = "SHOW_BACKUP_PHRASE", e.SAVE_ALLOWLIST = "SAVE_ALLOWLIST", e.SAVE_SETTINGS = "SAVE_SETTINGS", e.LOAD_SETTINGS = "LOAD_SETTINGS", e.GET_CACHED_ASSET_ICON = "GET_CACHED_ASSET_ICON", e.CACHE_ASSET_ICON = "CACHE_ASSET_ICON", e.GET_CACHED_ASSET_DOMAIN = "GET_CACHED_ASSET_DOMAIN", e.CACHE_ASSET_DOMAIN = "CACHE_ASSET_DOMAIN", e.GET_BLOCKED_ACCOUNTS = "GET_BLOCKED_ACCOUNTS", e.GET_BLOCKED_DOMAINS = "GET_BLOCKED_DOMAINS", e.ADD_CUSTOM_NETWORK = "ADD_CUSTOM_NETWORK", e.CHANGE_NETWORK = "CHANGE_NETWORK", e.REMOVE_CUSTOM_NETWORK = "REMOVE_CUSTOM_NETWORK", e.EDIT_CUSTOM_NETWORK = "EDIT_CUSTOM_NETWORK", e.RESET_EXP_DATA = "RESET_EXP_DATA", e.ADD_TOKEN_ID = "ADD_TOKEN_ID", e.GET_TOKEN_IDS = "GET_TOKEN_IDS", e.REMOVE_TOKEN_ID = "REMOVE_TOKEN_ID", e.GET_MIGRATABLE_ACCOUNTS = "GET_MIGRATABLE_ACCOUNTS", e.GET_MIGRATED_MNEMONIC_PHRASE = "GET_MIGRATED_MNEMONIC_PHRASE", e.MIGRATE_ACCOUNTS = "MIGRATE_ACCOUNTS";
        }(e || (e = {})), function(e) {
            e.REQUEST_ACCESS = "REQUEST_ACCESS", e.REQUEST_PUBLIC_KEY = "REQUEST_PUBLIC_KEY", e.SUBMIT_TRANSACTION = "SUBMIT_TRANSACTION", e.SUBMIT_BLOB = "SUBMIT_BLOB", e.SUBMIT_AUTH_ENTRY = "SUBMIT_AUTH_ENTRY", e.REQUEST_NETWORK = "REQUEST_NETWORK", e.REQUEST_NETWORK_DETAILS = "REQUEST_NETWORK_DETAILS", e.REQUEST_CONNECTION_STATUS = "REQUEST_CONNECTION_STATUS", e.REQUEST_ALLOWED_STATUS = "REQUEST_ALLOWED_STATUS", e.SET_ALLOWED_STATUS = "SET_ALLOWED_STATUS", e.REQUEST_USER_INFO = "REQUEST_USER_INFO";
        }(r || (r = {}));
        const T = (e)=>{
            const E = Date.now() + Math.random();
            return window.postMessage({
                source: "FREIGHTER_EXTERNAL_MSG_REQUEST",
                messageId: E,
                ...e
            }, window.location.origin), new Promise((o)=>{
                let T = 0;
                e.type !== r.REQUEST_CONNECTION_STATUS && e.type !== r.REQUEST_PUBLIC_KEY || (T = setTimeout(()=>{
                    o({
                        isConnected: !1,
                        publicKey: ""
                    }), window.removeEventListener("message", _);
                }, 2e3));
                const _ = (e)=>{
                    var r, t;
                    e.source === window && "FREIGHTER_EXTERNAL_MSG_RESPONSE" === (null === (r = null == e ? void 0 : e.data) || void 0 === r ? void 0 : r.source) && (null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.messagedId) === E && (o(e.data), window.removeEventListener("message", _), clearTimeout(T));
                };
                window.addEventListener("message", _, !1);
            });
        }, _ = ()=>c ? (async ()=>{
                let e = {
                    publicKey: "",
                    error: ""
                };
                try {
                    e = await T({
                        type: r.REQUEST_PUBLIC_KEY
                    });
                } catch (e) {
                    console.error(e);
                }
                const { publicKey: E, error: o } = e;
                if (o) throw o;
                return E;
            })() : Promise.resolve(""), t = (e, E)=>c ? (async (e, E, o)=>{
                let _ = "", t = "", A = "";
                "object" == typeof E ? (_ = E.network || "", t = E.accountToSign || "", A = E.networkPassphrase || "") : (_ = E || "", t = "");
                let S = {
                    signedTransaction: "",
                    error: ""
                };
                try {
                    S = await T({
                        transactionXdr: e,
                        network: _,
                        networkPassphrase: A,
                        accountToSign: t,
                        type: r.SUBMIT_TRANSACTION
                    });
                } catch (e) {
                    throw console.error(e), e;
                }
                const { signedTransaction: n, error: N } = S;
                if (N) throw N;
                return n;
            })(e, E) : Promise.resolve(""), A = (e, E)=>c ? (async (e, E)=>{
                let o = {
                    signedBlob: "",
                    error: ""
                };
                const _ = (E || {}).accountToSign || "";
                try {
                    o = await T({
                        blob: e,
                        accountToSign: _,
                        type: r.SUBMIT_BLOB
                    });
                } catch (e) {
                    throw console.error(e), e;
                }
                const { signedBlob: t, error: A } = o;
                if (A) throw A;
                return t;
            })(e, E) : Promise.resolve(""), S = (e, E)=>c ? (async (e, E)=>{
                let o = {
                    signedAuthEntry: "",
                    error: ""
                };
                const _ = (E || {}).accountToSign || "";
                try {
                    o = await T({
                        entryXdr: e,
                        accountToSign: _,
                        type: r.SUBMIT_AUTH_ENTRY
                    });
                } catch (e) {
                    console.error(e);
                }
                const { signedAuthEntry: t, error: A } = o;
                if (A) throw A;
                return t;
            })(e, E) : Promise.resolve(""), n = ()=>c ? window.freighter ? Promise.resolve(window.freighter) : (async ()=>{
                let e = {
                    isConnected: !1
                };
                try {
                    e = await T({
                        type: r.REQUEST_CONNECTION_STATUS
                    });
                } catch (e) {
                    console.error(e);
                }
                return e.isConnected;
            })() : Promise.resolve(!1), N = ()=>c ? (async ()=>{
                let e = {
                    network: "",
                    error: ""
                };
                try {
                    e = await T({
                        type: r.REQUEST_NETWORK
                    });
                } catch (e) {
                    console.error(e);
                }
                const { network: E, error: o } = e;
                if (o) throw o;
                return E;
            })() : Promise.resolve(""), s = ()=>c ? (async ()=>{
                let e = {
                    networkDetails: {
                        network: "",
                        networkName: "",
                        networkUrl: "",
                        networkPassphrase: "",
                        sorobanRpcUrl: void 0
                    },
                    error: ""
                };
                try {
                    e = await T({
                        type: r.REQUEST_NETWORK_DETAILS
                    });
                } catch (e) {
                    console.error(e);
                }
                const { networkDetails: E, error: o } = e, { network: _, networkUrl: t, networkPassphrase: A, sorobanRpcUrl: S } = E;
                if (o) throw o;
                return {
                    network: _,
                    networkUrl: t,
                    networkPassphrase: A,
                    sorobanRpcUrl: S
                };
            })() : Promise.resolve({
                network: "",
                networkUrl: "",
                networkPassphrase: "",
                sorobanRpcUrl: ""
            }), C = ()=>c ? (async ()=>{
                let e = {
                    isAllowed: !1
                };
                try {
                    e = await T({
                        type: r.REQUEST_ALLOWED_STATUS
                    });
                } catch (e) {
                    console.error(e);
                }
                return e.isAllowed;
            })() : Promise.resolve(!1), O = ()=>c ? (async ()=>{
                let e = {
                    isAllowed: !1,
                    error: ""
                };
                try {
                    e = await T({
                        type: r.SET_ALLOWED_STATUS
                    });
                } catch (e) {
                    console.error(e);
                }
                const { isAllowed: E, error: o } = e;
                if (o) throw o;
                return E;
            })() : Promise.resolve(!1), R = ()=>c ? (async ()=>{
                let e = {
                    userInfo: {
                        publicKey: ""
                    },
                    error: ""
                };
                try {
                    e = await T({
                        type: r.REQUEST_USER_INFO
                    });
                } catch (e) {
                    console.error(e);
                }
                const { userInfo: E, error: o } = e;
                if (o) throw o;
                return E;
            })() : Promise.resolve({
                publicKey: ""
            }), i = ()=>c ? (async ()=>{
                let e = {
                    publicKey: "",
                    error: ""
                };
                try {
                    e = await T({
                        type: r.REQUEST_ACCESS
                    });
                } catch (e) {
                    console.error(e);
                }
                const { publicKey: E, error: o } = e;
                if (o) throw o;
                return E;
            })() : Promise.resolve(""), c = "undefined" != typeof window, I = {
            getPublicKey: _,
            signTransaction: t,
            signBlob: A,
            signAuthEntry: S,
            isConnected: n,
            getNetwork: N,
            getNetworkDetails: s,
            isAllowed: C,
            setAllowed: O,
            getUserInfo: R,
            requestAccess: i
        };
        return o;
    })()); //# sourceMappingURL=index.min.js.map
}),
]);

//# sourceMappingURL=_ce4185ee._.js.map