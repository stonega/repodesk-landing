export type WorkflowStory = "connect" | "conversation" | "review";

export default function WorkflowIllustration({
  story,
}: {
  story: WorkflowStory;
}) {
  return (
    <svg
      className={`workflow-illustration story-${story}`}
      viewBox="0 0 320 200"
      width="320"
      height="200"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="160"
        cy="177"
        rx="102"
        ry="10"
        fill="#b86c35"
        opacity=".11"
      />
      {story === "connect" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#ffecc7" />
          <path
            d="M67 78V61a10 10 0 0 1 10-10h53l17 17h91a10 10 0 0 1 10 10v78H67Z"
            fill="#f7b36b"
            stroke="#7d3a18"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="103"
            y="34"
            width="119"
            height="115"
            rx="12"
            fill="#fffdf8"
            stroke="#7d3a18"
            strokeWidth="3"
            transform="rotate(7 162 92)"
          />
          <path
            d="m140 64-13 13 13 13m43-26 13 13-13 13m-19-31-10 36"
            fill="none"
            stroke="#c94d1e"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M63 92h190l-14 69a12 12 0 0 1-12 10H86a12 12 0 0 1-12-10Z"
            fill="#ffd499"
            stroke="#7d3a18"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="105"
            y="117"
            width="104"
            height="27"
            rx="13"
            fill="#fff9ef"
          />
          <path
            d="M125 131h64"
            stroke="#c94d1e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="254"
            cy="57"
            r="22"
            fill="#fff"
            stroke="#7d3a18"
            strokeWidth="3"
          />
          <path
            d="M244 62h20l-4-10-6 4-6-4Z"
            fill="#ffa348"
            stroke="#7d3a18"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M254 45l6 11h-12Z"
            fill="#ffe26b"
            stroke="#7d3a18"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="m72 28 3 7 8 3-8 3-3 8-3-8-7-3 7-3Z" fill="#f27242" />
          <path
            d="M51 110l-6 6m0-6 6 6"
            stroke="#9a4e26"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {story === "conversation" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#ffe6d3" />
          <path
            d="M61 50a14 14 0 0 1 14-14h122a14 14 0 0 1 14 14v63a14 14 0 0 1-14 14h-87l-28 21v-21h-7a14 14 0 0 1-14-14Z"
            fill="#fffdf9"
            stroke="#7d3a18"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M87 66h93M87 82h64"
            stroke="#e4a97a"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M125 101a14 14 0 0 1 14-14h104a14 14 0 0 1 14 14v46a14 14 0 0 1-14 14h-7v20l-27-20h-70a14 14 0 0 1-14-14Z"
            fill="#ffa348"
            stroke="#7d3a18"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M172 117v5m36-5v5m-34 14q16 14 32 0"
            fill="none"
            stroke="#fffdf8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="m239 33 4 10 11 4-11 4-4 11-4-11-10-4 10-4Z"
            fill="#ffe26b"
            stroke="#c94d1e"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="66" cy="162" r="5.5" fill="#f27242" />
          <path
            d="m273 78 5 5m0-5-5 5"
            stroke="#c94d1e"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {story === "review" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#e6f5ec" />
          <rect
            x="83"
            y="29"
            width="157"
            height="141"
            rx="14"
            fill="#fffdf9"
            stroke="#6a4834"
            strokeWidth="3"
            transform="rotate(-4 161 100)"
          />
          <path d="M95 60h132" stroke="#ecd9c7" strokeWidth="3" />
          <circle cx="106" cy="47" r="3.5" fill="#f27242" />
          <circle cx="118" cy="46" r="3.5" fill="#ffa348" />
          <circle cx="130" cy="45" r="3.5" fill="#2a8d5c" />
          <path
            d="M125 89v51m47-51v11q0 15-23 15h-24"
            fill="none"
            stroke="#c94d1e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g fill="#fff1e3" stroke="#7d3a18" strokeWidth="3">
            <circle cx="125" cy="86" r="9" />
            <circle cx="172" cy="86" r="9" />
            <circle cx="125" cy="141" r="9" />
          </g>
          <path
            d="M192 116h24m-24 13h17"
            stroke="#dfb693"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="234"
            cy="152"
            r="25"
            fill="#b9ebd0"
            stroke="#1d7648"
            strokeWidth="3"
          />
          <path
            d="m224 152 7 7 13-15"
            fill="none"
            stroke="#1d7648"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m62 56 3 8 9 3-9 3-3 9-3-9-8-3 8-3Z" fill="#ffa348" />
          <path
            d="m61 141 5 5m0-5-5 5"
            stroke="#7d3a18"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
