import { useState, SyntheticEvent, FC } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useAppSelector } from "@/hooks/useRedux";

interface CashBoxAccordionProps {}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={2} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .07)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const CashBoxAccordion: FC<CashBoxAccordionProps> = ({}) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { cashboxState } = useAppSelector((state) => state);
  
  const handleChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
          <h3 className="text-2xl font-semibold">Общая касса</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p className="text-xl font-semibold">
            Всего: {cashboxState.generalTotal}
          </p>
          <p>Наличные: {cashboxState.generalCash}</p>
          <p>Карта: {cashboxState.generalCard}</p>
          <p>Каспи: {cashboxState.generalKaspi}</p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header">
          <h3 className="text-xl">Услуги</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p className="text-xl font-semibold">
            Всего: {cashboxState.visitsTotal}
          </p>
          <p>Наличные: {cashboxState.visitsCash}</p>
          <p>Карта: {cashboxState.visitsCard}</p>
          <p>Каспи: {cashboxState.visitsKaspi}</p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3bh-content" id="panel3bh-header">
          <h3 className="text-xl">Продажи</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p className="text-xl font-semibold">
            Всего: {cashboxState.salesTotal}
          </p>
          <p>Наличные: {cashboxState.salesCash}</p>
          <p>Карта: {cashboxState.salesCard}</p>
          <p>Каспи: {cashboxState.salesKaspi}</p>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4bh-content" id="panel4bh-header">
          <h3 className="text-xl">Краска</h3>
        </AccordionSummary>
        <AccordionDetails>
          <p className="text-xl font-semibold">Всего: 0</p>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CashBoxAccordion;
