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
        fill="currentColor"
        opacity=".08"
      />
      {story === "connect" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#d9f5e8" />
          <path
            d="M67 78V61a10 10 0 0 1 10-10h53l17 17h91a10 10 0 0 1 10 10v78H67Z"
            fill="#8adab3"
            stroke="#22644a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="103"
            y="34"
            width="119"
            height="115"
            rx="10"
            fill="white"
            stroke="#22644a"
            strokeWidth="3"
            transform="rotate(8 162 92)"
          />
          <path
            d="m140 64-13 13 13 13m43-26 13 13-13 13m-19-31-10 36"
            fill="none"
            stroke="#3d9369"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M63 92h190l-14 69a12 12 0 0 1-12 10H86a12 12 0 0 1-12-10Z"
            fill="#b4edce"
            stroke="#22644a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="105"
            y="117"
            width="104"
            height="27"
            rx="13"
            fill="#effcf4"
          />
          <path
            d="M125 131h64"
            stroke="#4d936d"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="254"
            cy="57"
            r="21"
            fill="#fff"
            stroke="#22644a"
            strokeWidth="3"
          />
          <path
            d="M245 57h18m-9-9v18M51 110l-6 6m0-6 6 6"
            stroke="#22644a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="m72 28 3 7 8 3-8 3-3 8-3-8-7-3 7-3Z" fill="#e9b45b" />
        </>
      )}
      {story === "conversation" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#dfeeff" />
          <path
            d="M61 50a12 12 0 0 1 12-12h126a12 12 0 0 1 12 12v65a12 12 0 0 1-12 12h-89l-28 21v-21h-9a12 12 0 0 1-12-12Z"
            fill="#fff"
            stroke="#326789"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M87 66h93M87 82h64"
            stroke="#8dbbd9"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M127 101a12 12 0 0 1 12-12h106a12 12 0 0 1 12 12v48a12 12 0 0 1-12 12h-9v20l-27-20h-70a12 12 0 0 1-12-12Z"
            fill="#9edaba"
            stroke="#22644a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M174 116v5m35-5v5m-34 15q17 15 34 0"
            fill="none"
            stroke="#22644a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="m239 33 4 10 11 4-11 4-4 11-4-11-10-4 10-4Z"
            fill="#e9b45b"
          />
          <circle cx="65" cy="164" r="5" fill="#8dbbd9" />
          <path
            d="m273 78 4 4m0-4-4 4"
            stroke="#326789"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {story === "review" && (
        <>
          <circle cx="160" cy="96" r="78" fill="#ffeadc" />
          <rect
            x="83"
            y="29"
            width="157"
            height="141"
            rx="12"
            fill="#fff"
            stroke="#8b5940"
            strokeWidth="3"
            transform="rotate(-5 161 100)"
          />
          <path d="M95 60h132" stroke="#edd8cb" strokeWidth="3" />
          <circle cx="106" cy="47" r="3" fill="#df9b7a" />
          <circle cx="118" cy="46" r="3" fill="#e8c773" />
          <circle cx="130" cy="45" r="3" fill="#86bb9b" />
          <path
            d="M125 89v51m47-51v11q0 15-23 15h-24"
            fill="none"
            stroke="#3d9369"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g fill="#e1f7eb" stroke="#22644a" strokeWidth="3">
            <circle cx="125" cy="86" r="9" />
            <circle cx="172" cy="86" r="9" />
            <circle cx="125" cy="141" r="9" />
          </g>
          <path
            d="M192 116h24m-24 13h17"
            stroke="#d6b29b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            cx="234"
            cy="152"
            r="25"
            fill="#b4edce"
            stroke="#22644a"
            strokeWidth="3"
          />
          <path
            d="m224 152 7 7 13-15"
            fill="none"
            stroke="#22644a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="m62 56 3 8 9 3-9 3-3 9-3-9-8-3 8-3Z" fill="#e9b45b" />
          <path
            d="m61 141 5 5m0-5-5 5"
            stroke="#8b5940"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
