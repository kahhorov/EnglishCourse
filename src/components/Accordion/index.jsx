import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { MdOutlineArrowRight, MdLibraryBooks } from "react-icons/md";
import {
  Collapse,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

// --- STYLED COMPONENTS ---
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  paddingTop: "20px",
  background: "none",
  "&:not(:first-of-type)": {
    borderTop: "1px dotted rgba(255, 255, 255, 0.1)",
  },
  "&::before": {
    display: "none",
  },
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&.Mui-expanded": {
    margin: "16px 0",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <MdOutlineArrowRight style={{ fontSize: "1.5rem", color: "#60a5fa" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  padding: "12px 16px",
  borderRadius: "12px",
  minHeight: "56px !important",
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: "rotate(90deg)",
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  "&.Mui-expanded": {
    backgroundColor: "rgba(96, 165, 250, 0.08)",
    borderBottom: "1px solid rgba(96, 165, 250, 0.2)",
  },
  ...theme.applyStyles("dark", {
    background: "none",
  }),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "none",
  color: "#fff",
  borderRadius: "0 0 12px 12px",
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState("panel1");
  const [openFormulas, setOpenFormulas] = React.useState({});
  const [topics, setTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Firebase'dan ma'lumotlarni o'qish
  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "topics"));
        const topicsData = [];
        querySnapshot.forEach((doc) => {
          topicsData.push({ id: doc.id, ...doc.data() });
        });
        // order fieldi bo'yicha tartiblash, agar mavjud bo'lsa
        topicsData.sort((a, b) => {
          if (a.order && b.order) return a.order - b.order;
          return 0;
        });
        setTopics(topicsData);
      } catch (error) {
        console.error("Ma'lumotlarni o'qishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleFormulaToggle = (topicId, ruleIndex, formulaIndex) => {
    const key = `${topicId}-${ruleIndex}-${formulaIndex}`;
    setOpenFormulas((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Loading holati
  if (loading) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 gap-4">
        <Box className="relative">
          <CircularProgress
            size={60}
            sx={{
              color: "#3b82f6",
              animationDuration: "1.5s",
            }}
          />
          <Box
            className="absolute inset-0 flex items-center justify-center"
            sx={{ animation: "pulse 2s infinite" }}
          >
            <Typography className="text-blue-400 text-xs font-medium">
              ...
            </Typography>
          </Box>
        </Box>
        <Typography className="text-gray-400 text-sm animate-pulse">
          Mavzular yuklanmoqda...
        </Typography>
      </Box>
    );
  }

  // Bo'sh holat
  if (topics.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-blue-500/20 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-sm">
        <Box className="relative mb-6">
          <MdLibraryBooks size={60} className="text-blue-400/60" />
          <Box className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Typography className="text-white text-xs">0</Typography>
          </Box>
        </Box>
        <Typography className="text-white text-xl font-semibold mb-2">
          Hali mavzular yo'q
        </Typography>
        <Typography className="text-gray-400 text-sm text-center max-w-xs">
          Firebase bazasida "topics" kolleksiyasi bo'sh yoki ma'lumotlar hali
          qo'shilmagan.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {topics?.map((topic, topicIndex) => {
        const panelId = `panel${topic.id || topicIndex + 1}`;

        return (
          <Accordion
            key={topic.id}
            expanded={expanded === panelId}
            onChange={handleTopicChange(panelId)}
            sx={{
              width: "100%",
              mb: { xs: 2, sm: 3 },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              },
            }}
          >
            <AccordionSummary
              aria-controls={`${panelId}-content`}
              id={`${panelId}-header`}
              sx={{
                color: "#fff",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <Box className="flex justify-between items-center w-full">
                <Typography
                  component="span"
                  className="font-semibold text-base sm:text-lg md:text-xl"
                  sx={{
                    color: "#f3f4f6",
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {topic.theme}
                </Typography>

                {topic.themeFormula && (
                  <Box className="hidden sm:flex justify-end ml-2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-3 py-1 text-xs font-medium text-green-400 border border-green-500/20 whitespace-nowrap backdrop-blur-sm">
                      {topic.themeFormula}
                    </span>
                  </Box>
                )}
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                borderRadius: "0 0 12px 12px",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4 },
                width: "100%",
              }}
            >
              {/* Guruh nomi */}
              {topic.groupName && (
                <Box className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                  <Box className="w-2 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
                  <Typography className="text-blue-300 !text-sm sm:!text-base font-semibold">
                    {topic.groupName}
                  </Typography>
                </Box>
              )}

              {/* Qoidalar */}
              {topic.rules &&
                topic.rules.map((rule, ruleIndex) => (
                  <Box
                    key={ruleIndex}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-5"
                  >
                    <Box className="flex items-start gap-3 sm:gap-0">
                      <Box className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                        <Typography className="!text-sm font-bold text-white">
                          {ruleIndex + 1}
                        </Typography>
                      </Box>
                      {isMobile && (
                        <Box className="flex-1 sm:hidden">
                          <Typography className="!text-sm text-gray-200">
                            {rule.text}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box className="flex-1">
                      {/* Desktop uchun qoida matni */}
                      {!isMobile && (
                        <Typography className="!text-sm sm:!text-base text-gray-200 mb-3">
                          {rule.text}
                        </Typography>
                      )}

                      {/* Qoida shakli */}
                      {rule.shape && (
                        <Box className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg mb-4">
                          <Box className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                          <Typography className="!text-xs text-yellow-400 font-mono">
                            {rule.shape}
                          </Typography>
                        </Box>
                      )}

                      {/* Formulalar - Responsive grid */}
                      {rule.formulas && (
                        <Box
                          className="grid gap-3 mb-4"
                          sx={{
                            gridTemplateColumns: {
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                              md: "repeat(3, 1fr)",
                              lg: "repeat(4, 1fr)",
                            },
                          }}
                        >
                          {rule.formulas.map((formula, formulaIndex) => {
                            const formulaKey = `${topic.id}-${ruleIndex}-${formulaIndex}`;
                            const isOpen = openFormulas[formulaKey] || false;

                            return (
                              <Box
                                key={formulaIndex}
                                className="relative group"
                                sx={{
                                  minWidth: { xs: "100%", sm: "140px" },
                                }}
                              >
                                {/* Formula bosiladigan qism */}
                                <Box
                                  onClick={() =>
                                    handleFormulaToggle(
                                      topic.id,
                                      ruleIndex,
                                      formulaIndex,
                                    )
                                  }
                                  className="flex items-center gap-2 cursor-pointer select-none p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                  sx={{
                                    background: isOpen
                                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1))"
                                      : "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))",
                                    border: isOpen
                                      ? "1px solid rgba(59, 130, 246, 0.3)"
                                      : "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: isOpen
                                      ? "0 4px 20px rgba(59, 130, 246, 0.2)"
                                      : "0 2px 10px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  {isOpen ? (
                                    <KeyboardArrowDownIcon
                                      sx={{
                                        fontSize: { xs: "1rem", sm: "1.2rem" },
                                        color: "#60a5fa",
                                      }}
                                    />
                                  ) : (
                                    <KeyboardArrowRightIcon
                                      sx={{
                                        fontSize: { xs: "1rem", sm: "1.2rem" },
                                        color: "#9ca3af",
                                      }}
                                    />
                                  )}
                                  <Typography
                                    className="!text-xs sm:!text-sm font-medium text-center flex-1"
                                    sx={{
                                      color: isOpen ? "#93c5fd" : "#e5e7eb",
                                      fontWeight: isOpen ? 600 : 500,
                                    }}
                                  >
                                    {formula.formula}
                                  </Typography>
                                </Box>
                                {/* Formula tafsilotlari */}
                                <Collapse
                                  in={isOpen}
                                  timeout={300}
                                  unmountOnExit
                                >
                                  <Box
                                    className="mt-3 ml-2 sm:ml-8 p-3 sm:p-4 rounded-xl"
                                    sx={{
                                      background:
                                        "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
                                      borderLeft:
                                        "3px solid rgba(59, 130, 246, 0.5)",
                                      boxShadow:
                                        "0 4px 20px rgba(0, 0, 0, 0.3)",
                                    }}
                                  >
                                    <Box className="flex gap-3">
                                      <Box className="flex flex-col items-center">
                                        <Box className="w-2  h-2 rounded-full bg-blue-500 mt-1" />
                                        <Box className="w-px h-full bg-gradient-to-b from-blue-500 to-transparent mt-1" />
                                      </Box>
                                      <Box className="flex-1">
                                        <Typography className="text-gray-300 !text-xs sm:!text-sm leading-relaxed mb-3">
                                          {formula.title}
                                        </Typography>

                                        {formula.examples?.length > 0 && (
                                          <Box className="space-y-2 mb-4">
                                            <Typography className="text-gray-400 !text-xs font-medium mb-2">
                                              Misollar:
                                            </Typography>
                                            {formula.examples.map(
                                              (example, exampleIndex) => (
                                                <Box
                                                  key={exampleIndex}
                                                  className="flex items-start gap-2 p-2 bg-gradient-to-r from-blue-500/5 to-transparent rounded-lg"
                                                >
                                                  <Box className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20">
                                                    <Typography className="!text-xs text-blue-400 font-bold">
                                                      {exampleIndex + 1}
                                                    </Typography>
                                                  </Box>
                                                  <Typography className="text-blue-200 !text-xs sm:!text-sm flex-1">
                                                    {example}
                                                  </Typography>
                                                </Box>
                                              ),
                                            )}
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>

                                    {formula.note && (
                                      <Box
                                        className="mt-4 p-3 rounded-lg"
                                        sx={{
                                          background:
                                            "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))",
                                          border:
                                            "1px solid rgba(34, 197, 94, 0.2)",
                                        }}
                                      >
                                        <Typography className="text-green-400 !text-xs italic flex items-start gap-2">
                                          <span className="text-green-500 text-lg">
                                            💡
                                          </span>
                                          <span>{formula.note}</span>
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                </Collapse>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}

              {/* Oddiy text qoidalar */}
              {topic.simpleRules && topic.simpleRules.length > 0 && (
                <Box className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-700/50">
                  <Box className="flex items-center gap-2 mb-3">
                    <Box className="w-2 h-5 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    <Typography className="text-gray-300 !text-sm sm:!text-base font-semibold">
                      Qoidalar:
                    </Typography>
                  </Box>
                  <Box className="space-y-2 sm:space-y-3">
                    {topic.simpleRules.map((simpleRule, idx) => (
                      <Box
                        key={idx}
                        className="flex items-start gap-3 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Box className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mt-0.5">
                          <Typography className="!text-xs text-purple-400 font-bold">
                            •
                          </Typography>
                        </Box>
                        <Typography className="text-gray-300 !text-xs sm:!text-sm flex-1">
                          {simpleRule}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Mobile uchun themeFormula */}
              {topic.themeFormula && isMobile && (
                <Box className="mt-4 pt-4 border-t border-gray-700/50">
                  <Typography className="text-gray-400 !text-xs mb-2">
                    Asosiy formula:
                  </Typography>
                  <Box className="inline-flex items-center rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-3 py-2">
                    <Typography className="text-green-400 !text-sm font-mono">
                      {topic.themeFormula}
                    </Typography>
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
